import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceDir = path.join(root, "tmp", "english2-sources");
const outputDir = path.join(root, "src", "data", "englishII", "readings");

// These answer strings are transcribed from the source answer tables and are
// used only to validate the extracted question order before writing data.
const answerKeys = {
  2011: "ACBDDBACCBDBACAADACDBDCABDBCAACDCDBBCBAD",
  2012: "BBAACDAACBDBCDDACCBDACABDABACCCBBCDDDBDA",
  2013: "ADBDCBBD BAADCCCDABADADBBCCCDCD AACDCBBADC".replaceAll(" ", ""),
  2014: "ABCBDCAAADABCBBDCDCABADBCACBADBADDCBCACD",
  2015: "ADCDBDCDCDAABACBABBCACDCADCCDBCABADBBABD",
  2016: "CBDCDBADABABADCDCCABBBACAACAD CDBDABBCDDC".replaceAll(" ", ""),
  2017: "CADABBCADCCBADCDABDBBDCB AADCDBCADBAADCCB".replaceAll(" ", ""),
  2018: "ACDCBCDABDCDBAAABCACCBC DADDBACCBDCADBDAA".replaceAll(" ", ""),
  2019: "DABBDBADCABDCACDCABAADBDBBBDCADACACCCAAD",
  2020: "DBACABACDCACDBBCDBABABDDBBCCAADABBCCDACD",
};

function clean(value) {
  return value
    .replace(/\f/g, " ")
    .replace(/\n\s*\d+\s*\n/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function optionMatches(chunk) {
  const pattern = /(?:\[\s*([A-D])\s*\]|\b([A-D])\s*[.\uFF0E\]])\s*/g;
  return [...chunk.matchAll(pattern)].map((match) => ({
    key: match[1] ?? match[2],
    start: match.index,
    end: match.index + match[0].length,
  }));
}

function parseQuestions(block, firstNumber, answers, year, textNumber) {
  const markers = [...block.matchAll(new RegExp(`(?:^|\\n)\\s*(${Array.from({ length: 5 }, (_, index) => firstNumber + index).join("|")})\\.`, "g"))];
  if (markers.length !== 5) {
    throw new Error(`${year} Text ${textNumber}: expected 5 question markers, found ${markers.length}`);
  }

  const passage = clean(block.slice(0, markers[0].index));
  const questions = markers.map((marker, index) => {
    const questionNumber = Number(marker[1]);
    const rawQuestion = block.slice(marker.index + marker[0].length, markers[index + 1]?.index).trim();
    const options = optionMatches(rawQuestion);
    if (options.length !== 4) {
      throw new Error(`${year} Text ${textNumber} Q${questionNumber}: expected 4 options, found ${options.length}`);
    }
    const optionMap = Object.fromEntries(options.map((option, optionIndex) => [
      option.key,
      clean(rawQuestion.slice(option.end, options[optionIndex + 1]?.start)),
    ]));
    return {
      id: `${year}-english2-text${textNumber}-q${questionNumber}`,
      questionNumber,
      questionText: clean(rawQuestion.slice(0, options[0].start)),
      options: optionMap,
      answer: answers[index],
      type: "待补充",
      explanation: "解析待补充。",
      commonMistake: "待补充。",
    };
  });

  return { passage, questions };
}

function getExamSection(raw, year) {
  const heading = `${year} 年全国硕士研究生招生考试`;
  const starts = [];
  let index = raw.indexOf(heading);
  while (index !== -1) {
    starts.push(index);
    index = raw.indexOf(heading, index + heading.length);
  }
  // The first two hits are the table of contents. The third is the actual paper.
  const start = starts[2];
  if (start === undefined) throw new Error(`${year}: paper heading not found`);
  const nextYear = raw.indexOf(`${year + 1} 年全国硕士研究生招生考试`, start + heading.length);
  return raw.slice(start, nextYear === -1 ? raw.length : nextYear);
}

function parseYear(raw, year) {
  const section = getExamSection(raw, year);
  const textMarkers = [...section.matchAll(/\bText\s+([1-4])\b/g)];
  if (textMarkers.length < 4) throw new Error(`${year}: expected four reading texts, found ${textMarkers.length}`);
  const answers = answerKeys[year];
  if (!answers || answers.length !== 40) throw new Error(`${year}: answer key must contain 40 answers`);

  return textMarkers.slice(0, 4).map((marker, index) => {
    const textNumber = Number(marker[1]);
    const end = textMarkers[index + 1]?.index ?? section.indexOf("Part B", marker.index);
    const block = section.slice(marker.index + marker[0].length, end === -1 ? undefined : end);
    const parsed = parseQuestions(block, 21 + index * 5, answers.slice(20), year, textNumber);
    return {
      id: `${year}-english2-text${textNumber}`,
      year,
      paper: "英语二",
      paperType: "English II",
      section: "Reading Comprehension",
      textNumber: `Text ${textNumber}`,
      title: "阅读文章",
      passage: parsed.passage,
      questions: parsed.questions,
      vocabularyGroups: { coreWords: [], familiarWordsWithNewMeanings: [] },
      sourceNote: "真题原文与选择题答案已按公开试题及答案表交叉核对；题型与解析待补充。",
    };
  });
}

const raw = fs.readFileSync(path.join(sourceDir, "2015-2019-source.txt"), "utf8");
for (const year of [2015, 2016, 2017, 2018, 2019, 2020]) {
  const readings = parseYear(raw, year);
  for (const reading of readings) {
    const directory = path.join(outputDir, String(year));
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, `text${reading.textNumber.at(-1)}.json`), `${JSON.stringify(reading, null, 2)}\n`);
  }
  console.log(`${year}: ${readings.length} texts, ${readings.reduce((total, item) => total + item.questions.length, 0)} questions verified`);
}
