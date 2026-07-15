import text1 from "./readings/2010/text1.json" with { type: "json" };
import text2 from "./readings/2010/text2.json" with { type: "json" };
import text3 from "./readings/2010/text3.json" with { type: "json" };
import text4 from "./readings/2010/text4.json" with { type: "json" };

const unifiedExamReadings = Object.values(
  import.meta.glob("../papers/{2007,2008,2009}/text*.json", {
    eager: true,
    import: "default",
  }),
).map((reading) => ({
  ...reading,
  id: "english2-unified-" + (reading.id ?? String(reading.year) + "-" + reading.textNumber),
  paper: "英语二",
  paperType: "English II (Unified Exam Compatibility)",
  compatibilityNote: "2007—2009 年尚未区分英语一、英语二；此处以统一卷阅读作为英语二前置练习。",
}));

export default [text1, text2, text3, text4, ...unifiedExamReadings];
