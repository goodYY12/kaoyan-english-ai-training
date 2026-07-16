import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data", "englishII");
const years = Array.from({ length: 10 }, (_, index) => index + 2011);
const answers = new Set(["A", "B", "C", "D"]);

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
