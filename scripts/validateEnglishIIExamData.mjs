import fs from "node:fs";
import path from "node:path";
import { readingEnhancements2010 } from "../src/data/englishII/readingEnhancements2010.js";
import { applyEnglishIIReadingCorrections } from "../src/data/englishII/readingCorrections2011.js";
import { readingEnhancements2011 } from "../src/data/englishII/readingEnhancements2011.js";
import { readingEnhancements2012 } from "../src/data/englishII/readingEnhancements2012.js";
import { readingEnhancements2013 } from "../src/data/englishII/readingEnhancements2013.js";

const root = process.cwd();
const dataDir = path.join(root, "src", "data", "englishII");
const years = Array.from({ length: 16 }, (_, index) => index + 2011);
const answers = new Set(["A", "B", "C", "D"]);

const enhanced2010Readings = Object.entries(readingEnhancements2010);
if (enhanced2010Readings.length !== 4) throw new Error("2010: four English II reading enhancements are required");
for (const [readingId, reading] of enhanced2010Readings) {
  if (reading.vocabulary.length < 20) throw new Error(`${readingId}: at least twenty vocabulary items are required`);
  for (const [questionId, question] of Object.entries(reading.questions)) {
    if (!question.examinerThinking?.sourceSentence || !question.sentenceTraining?.sentence) {
      throw new Error(`${questionId}: analysis fields are missing`);
    }
  }
}
console.log("2010: reading analysis and vocabulary self-test data verified");

for (let textNumber = 1; textNumber <= 4; textNumber += 1) {
  const rawReading = readJson(path.join(dataDir, "readings", "2011", `text${textNumber}.json`));
  const reading = applyEnglishIIReadingCorrections(rawReading);
  if (reading.questions.length !== 5) throw new Error(`2011 Text ${textNumber}: five questions are required`);
  if (/\b(Fims|eroticism|cnormous|uremarked|hratened|returming|cheerleder)\b/i.test(reading.passage)) {
    throw new Error(`2011 Text ${textNumber}: unresolved OCR text remains`);
  }
  for (const question of reading.questions) {
    if (!question.questionText || !["A", "B", "C", "D"].every((key) => question.options[key])) {
      throw new Error(`2011 Text ${textNumber} Q${question.questionNumber}: corrected question data is incomplete`);
    }
  }
}
console.log("2011: reading OCR corrections and question choices verified");

for (const textNumber of [1, 2, 3, 4]) {
  const textVocabulary = readingEnhancements2011[`2011-english2-text${textNumber}`].vocabulary;
  if (textVocabulary.length < 20) throw new Error(`2011 Text ${textNumber}: at least twenty vocabulary items are required`);
  for (const item of textVocabulary) {
    if (!answers.has(item.answer) || !["A", "B", "C", "D"].every((key) => item.options[key])) {
      throw new Error(`2011 Text ${textNumber} vocabulary ${item.word}: invalid self-test choices`);
    }
  }
}
console.log("2011 Text 1-4: vocabulary self-test data verified");

const verified2012ReadingAnswers = ["ACABD", "ABACC", "CBACD", "DDBDA"];
for (const [index, expectedAnswers] of verified2012ReadingAnswers.entries()) {
  const reading = readJson(path.join(dataDir, "readings", "2012", `text${index + 1}.json`));
  const actualAnswers = reading.questions.map((question) => question.answer).join("");
  if (actualAnswers !== expectedAnswers) {
    throw new Error(`2012 Text ${index + 1}: expected ${expectedAnswers}, received ${actualAnswers}`);
  }
}
console.log("2012: verified reading answer keys confirmed");

for (const textNumber of [1, 2, 3, 4]) {
  const enhancedReading = readingEnhancements2012[`2012-english2-text${textNumber}`];
  if (enhancedReading.vocabulary.length < 20 || Object.keys(enhancedReading.questions).length !== 5) {
    throw new Error(`2012 Text ${textNumber}: analysis or vocabulary self-test data is incomplete`);
  }
  for (const item of enhancedReading.vocabulary) {
    if (!answers.has(item.answer) || !["A", "B", "C", "D"].every((key) => item.options[key])) {
      throw new Error(`2012 Text ${textNumber} vocabulary ${item.word}: invalid self-test choices`);
    }
  }
}
console.log("2012 Text 1-4: reading analysis and vocabulary self-test data verified");

for (const textNumber of [1, 2, 3]) {
  const enhancedReading = readingEnhancements2013[`2013-english2-text${textNumber}`];
  if (enhancedReading.vocabulary.length < 20 || Object.keys(enhancedReading.questions).length !== 5) {
    throw new Error(`2013 Text ${textNumber}: analysis or vocabulary self-test data is incomplete`);
  }
}
console.log("2013 Text 1-3: reading analysis and vocabulary self-test data verified");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

for (const year of years) {
  const readings = [1, 2, 3, 4].map((number) => readJson(path.join(dataDir, "readings", String(year), `text${number}.json`)));
  if (readings.some((reading) => reading.questions.length !== 5)) throw new Error(`${year}: every reading must have five questions`);
  for (const reading of readings) {
    for (const question of reading.questions) {
      if (!answers.has(question.answer) || !["A", "B", "C", "D"].every((key) => question.options[key])) {
        throw new Error(`${year} ${reading.textNumber} Q${question.questionNumber}: invalid options or answer`);
      }
    }
  }

  const cloze = readJson(path.join(dataDir, "cloze", `${year}.json`));
  if (cloze.blanks.length !== 20 || cloze.passageParts.filter((part) => part.type === "blank").length !== 20) {
    throw new Error(`${year}: cloze must have twenty blanks`);
  }
  for (const blank of cloze.blanks) {
    if (!answers.has(blank.answer) || !["A", "B", "C", "D"].every((key) => blank.options[key])) {
      throw new Error(`${year} cloze ${blank.id}: invalid options or answer`);
    }
  }

  const translation = readJson(path.join(dataDir, "translation", `${year}.json`));
  if (!translation.items?.[0]?.sourceText) throw new Error(`${year}: translation source is missing`);
  const writing = readJson(path.join(dataDir, "writing", `${year}.json`));
  if (!writing.smallWriting?.prompt || !writing.bigWriting?.prompt) throw new Error(`${year}: writing prompt is missing`);

  console.log(`${year}: reading, cloze, translation and writing data verified`);
}
