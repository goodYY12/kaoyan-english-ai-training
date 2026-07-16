import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "tmp", "english2-sources", "csgrad");
const dataDir = path.join(root, "src", "data", "englishII");
const years = Array.from({ length: 10 }, (_, index) => index + 2011);

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&ndash;|&mdash;/g, "-")
    .replace(/&hellip;/g, "...")
    .replace(/&mldr;/g, "...")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function text(value) {
  return decodeHtml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|li|h[1-6]|tr|div|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function between(raw, start, end, from = 0) {
  const startIndex = raw.indexOf(start, from);
  if (startIndex === -1) throw new Error(`Missing marker: ${start}`);
  const contentStart = startIndex + start.length;
  const endIndex = raw.indexOf(end, contentStart);
  if (endIndex === -1) throw new Error(`Missing marker: ${end}`);
  return raw.slice(contentStart, endIndex);
}

function questionBlock(raw, number) {
  const marker = `<h5 id=${number}>${number}</h5>`;
  const start = raw.indexOf(marker);
  if (start === -1) throw new Error(`Question ${number} not found`);
  const next = raw.indexOf("<h5 id=", start + marker.length);
  return raw.slice(start + marker.length, next === -1 ? undefined : next);
}

function answerForBlock(block, number) {
  const match = block.match(/data-answer=([A-D])\b/);
  if (!match) throw new Error(`Question ${number}: answer missing`);
  return match[1];
}

function optionsForBlock(block, number) {
  const options = [...block.matchAll(/<input[^>]+\bvalue=([A-D])>\s*<span class=choice-label>[A-D]\.<\/span>\s*<span class=choice-text>([\s\S]*?)<\/span>/g)];
  if (options.length !== 4) throw new Error(`Question ${number}: expected 4 options, received ${options.length}`);
  return Object.fromEntries(options.map((match) => [match[1], text(match[2])])) ;
}

function promptForBlock(block) {
  const beforeChoices = block.split('<div class="choice-container')[0];
  return text(beforeChoices);
}

function parseAnswerTable(raw, year) {
  const table = between(raw, "<summary class=elegant-summary>", "</details>");
  const values = [...table.matchAll(/<td>(\d+)<\/td><td>([A-D])<\/td>/g)];
  const answers = Object.fromEntries(values.map((match) => [Number(match[1]), match[2]]));
  if (Object.keys(answers).length !== 40) throw new Error(`${year}: expected 40 answer-table entries`);
  return answers;
}

function sectionUntil(raw, marker, nextMarker) {
  return between(raw, marker, nextMarker);
}

function passageForText(raw, textNumber) {
  const heading = new RegExp(`<h4 id=text-?${textNumber}>Text\\s*${textNumber}<\\/h4>`).exec(raw);
  if (!heading) throw new Error(`Text ${textNumber} passage heading not found`);
  const question = `<h5 id=${21 + (textNumber - 1) * 5}>${21 + (textNumber - 1) * 5}</h5>`;
  const start = heading.index + heading[0].length;
  const end = raw.indexOf(question, start);
  if (end === -1) throw new Error(`Text ${textNumber} first question not found`);
  return text(raw.slice(start, end));
}

function parseReadings(raw, year, tableAnswers) {
  return [1, 2, 3, 4].map((textNumber) => {
    const firstQuestion = 21 + (textNumber - 1) * 5;
    const questions = Array.from({ length: 5 }, (_, index) => {
      const number = firstQuestion + index;
      const block = questionBlock(raw, number);
      const answer = answerForBlock(block, number);
      if (answer !== tableAnswers[number]) throw new Error(`${year} Text ${textNumber} Q${number}: answer-table mismatch`);
      return {
        id: `${year}-english2-text${textNumber}-q${number}`,
        questionNumber: number,
        questionText: promptForBlock(block),
        options: optionsForBlock(block, number),
        answer,
        type: "待补充",
        explanation: "解析待补充。",
        commonMistake: "待补充。",
      };
    });
    return {
      id: `${year}-english2-text${textNumber}`,
      year,
      paper: "英语二",
      paperType: "English II",
      section: "Reading Comprehension",
      textNumber: `Text ${textNumber}`,
      title: "阅读文章",
      passage: passageForText(raw, textNumber),
      questions,
      vocabularyGroups: { coreWords: [], familiarWordsWithNewMeanings: [] },
      sourceNote: "题干、选项与答案已根据公开真题页面及其答案速对表交叉核验；题型和学习解析待补充。",
    };
  });
}

function clozePassageParts(raw, year) {
  let cloze = sectionUntil(raw, '<h4 id=text>Text</h4>', '<h5 id=1>1</h5>');
  if (year === 2014) {
    // The primary page omits the last three blanks in its rendered passage.
    // Append only that missing final paragraph from the complete public paper.
    const fallback = fs.readFileSync(path.join(sourceDir, "..", "2014-cloze-educity.html"), "utf8");
    const start = fallback.indexOf("<p>Negative attitudes");
    const end = fallback.indexOf("<p>1. [A]", start);
    if (start === -1 || end === -1) throw new Error("2014: complete cloze passage not found");
    cloze += fallback.slice(start, end).replace(/<span[^>]*>\s*_*(\d+)_*\s*<\/span>/g, "@@BLANK$1@@");
  }
  if (year === 2015) {
    // The primary page likewise omits its final three rendered blanks. This
    // is the missing closing paragraph from the complete local public paper.
    cloze += "<p>@@BLANK18@@, these commutes were reportedly more enjoyable compared with those without communication, which makes absolute sense, @@BLANK19@@ human beings thrive off of social connections. It's that @@BLANK20@@: Talking to strangers can make you feel connected.</p>";
  }
  // Each blank is rendered by KaTeX, but its visible number is consistently
  // kept in a `mord` span. Replacing that node before stripping markup keeps
  // the original blank order without depending on KaTeX's nested wrappers.
  let renderedBlankIndex = 0;
  cloze = cloze.replace(/<span class=mord>(\d+)<\/span>/g, (_, renderedNumber) => {
    renderedBlankIndex += 1;
    // The 2020 source labels its fifth KaTeX blank as "2" by mistake. The
    // surrounding sequence and the answer table confirm that it is blank 5.
    const blankNumber = year === 2020 ? renderedBlankIndex : Number(renderedNumber);
    return `@@BLANK${blankNumber}@@`;
  });
  const visible = text(cloze);
  const parts = visible.split(/@@BLANK(\d+)@@/);
  const blanks = parts.filter((_, index) => index % 2 === 1).map(Number);
  if (blanks.length !== 20 || new Set(blanks).size !== 20) throw new Error("Cloze passage should contain 20 unique blanks");
  return parts.map((content, index) => index % 2 === 0
    ? { type: "text", content }
    : { type: "blank", blankId: Number(content) });
}

function parseCloze(raw, year, tableAnswers) {
  const passageParts = clozePassageParts(raw, year);
  const blanks = Array.from({ length: 20 }, (_, index) => {
    const number = index + 1;
    const block = questionBlock(raw, number);
    const answer = answerForBlock(block, number);
    if (answer !== tableAnswers[number]) throw new Error(`${year} cloze ${number}: answer-table mismatch`);
    return {
      id: number,
      options: optionsForBlock(block, number),
      answer,
      type: "待补充",
      subType: "待补充",
      clue: "待补充",
      explanation: "解析待补充。",
      optionAnalysis: {},
      commonMistake: "待补充。",
      strategy: "结合句内搭配和上下文逻辑判断。",
    };
  });
  return {
    id: `${year}-english2-cloze`,
    year,
    paper: "英语二",
    title: "完形填空",
    sourceType: "真题",
    estimatedTime: 15,
    focusPoints: ["词义辨析", "固定搭配", "上下文逻辑", "语篇衔接"],
    passageParts,
    blanks,
    discourseAnalysis: { mainIdea: "待补充", structure: [], logicSignals: [] },
    vocabularyGroups: { coreWords: [], familiarWordsWithNewMeanings: [], phrases: [] },
    sourceNote: "题干、选项与答案已根据公开真题页面及其答案速对表交叉核验；学习解析待补充。",
  };
}

function solutionAfter(raw, startMarker, endMarker) {
  const section = sectionUntil(raw, startMarker, endMarker);
  const reference = section.match(/(?:参考译文|【参考译文】)(?:<\/strong>)?(?:<\/p>)?(?:<br>)?\s*(?:<p>)?([\s\S]*?)<\/p>/);
  return reference ? text(reference[1]) : "";
}

function parseTranslation(raw, year) {
  const sourceText = text(sectionUntil(raw, '<h5 id=46>46</h5>', '<div class="answer-container'));
  const referenceTranslation = solutionAfter(raw, '<h5 id=46>46</h5>', '<h3 id=写作>');
  if (!sourceText) throw new Error(`${year}: translation source missing`);
  return {
    id: `${year}-english2-translation`,
    year,
    paper: "英语二",
    sourceType: "真题",
    sourceNote: referenceTranslation
      ? "翻译原文和参考译文已根据公开真题页面核验。"
      : "翻译原文已根据公开真题页面核验；参考译文待补充。",
    items: [{
      id: `${year}-english2-translation-46`,
      sourceText,
      referenceTranslation,
      keyPoints: [],
      phrases: [],
      sentenceAnalysis: [],
      commonMistakes: [],
    }],
  };
}

function writingPrompt(raw, number, endMarker) {
  return text(sectionUntil(raw, `<h5 id=${number}>${number}</h5>`, endMarker));
}

function parseWriting(raw, year) {
  const smallPrompt = writingPrompt(raw, 47, '<div class="answer-container');
  const nextPart = raw.indexOf('<h4 id=part-b-1>Part B</h4>');
  const bigStart = raw.indexOf('<h5 id=48>48</h5>', nextPart);
  const bigEnd = raw.indexOf('<div class="answer-container', bigStart);
  const bigPrompt = text(raw.slice(bigStart + '<h5 id=48>48</h5>'.length, bigEnd));
  if (!smallPrompt || !bigPrompt) throw new Error(`${year}: writing prompt missing`);
  const task = (prompt) => ({
    prompt,
    taskType: "待补充",
    topic: "待补充",
    writingIdeas: [],
    structure: [],
    usefulExpressions: [],
    commonMistakes: [],
    sampleEssay: "",
  });
  return {
    id: `${year}-english2-writing`,
    year,
    paper: "英语二",
    sourceType: "真题",
    smallWriting: task(smallPrompt),
    bigWriting: task(bigPrompt),
  };
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

for (const year of years) {
  const raw = fs.readFileSync(path.join(sourceDir, `${year}.html`), "utf8");
  const tableAnswers = parseAnswerTable(raw, year);
  const readings = parseReadings(raw, year, tableAnswers);
  const cloze = parseCloze(raw, year, tableAnswers);
  const translation = parseTranslation(raw, year);
  const writing = parseWriting(raw, year);

  if (year <= 2014) {
    for (const reading of readings) {
      writeJson(path.join(dataDir, "readings", String(year), `text${reading.textNumber.at(-1)}.json`), reading);
    }
  }
  if (year !== 2010) writeJson(path.join(dataDir, "cloze", `${year}.json`), cloze);
  if (year !== 2010) writeJson(path.join(dataDir, "translation", `${year}.json`), translation);
  if (year !== 2010) writeJson(path.join(dataDir, "writing", `${year}.json`), writing);

  console.log(`${year}: 4 readings / 20 reading questions / 20 cloze blanks / translation / writing verified`);
}
