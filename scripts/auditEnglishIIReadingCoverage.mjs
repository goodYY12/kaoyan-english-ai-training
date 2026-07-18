import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readingEnhancements2010 } from "../src/data/englishII/readingEnhancements2010.js";
import { readingEnhancements2011 } from "../src/data/englishII/readingEnhancements2011.js";
import { readingEnhancements2012 } from "../src/data/englishII/readingEnhancements2012.js";
import { readingEnhancements2013 } from "../src/data/englishII/readingEnhancements2013.js";
import { readingEnhancements2014 } from "../src/data/englishII/readingEnhancements2014.js";
import { readingEnhancements2015 } from "../src/data/englishII/readingEnhancements2015.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const enhancements = {
  ...readingEnhancements2010,
  ...readingEnhancements2011,
  ...readingEnhancements2012,
  ...readingEnhancements2013,
  ...readingEnhancements2014,
  ...readingEnhancements2015,
};

for (let year = 2010; year <= 2026; year += 1) {
  for (let textNumber = 1; textNumber <= 4; textNumber += 1) {
    const filePath = path.join(root, "src", "data", "englishII", "readings", String(year), `text${textNumber}.json`);
    const reading = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const enhancement = enhancements[reading.id] ?? {};
    const questionEnhancements = enhancement.questions ?? {};
    const analyzed = reading.questions.filter((question) => {
      const item = questionEnhancements[question.id] ?? {};
      return item.examinerThinking?.sourceSentence && item.sentenceTraining?.sentence;
    }).length;
    const vocabulary = enhancement.vocabulary ?? reading.vocabulary ?? [];
    const validVocabulary = vocabulary.filter((item) => item.word && item.answer && ["A", "B", "C", "D"].every((key) => item.options?.[key])).length;
    console.log(`${year} | Text ${textNumber} | questions=${reading.questions.length}/5 | analysis=${analyzed}/5 | vocabulary=${validVocabulary}/${vocabulary.length}`);
  }
}
