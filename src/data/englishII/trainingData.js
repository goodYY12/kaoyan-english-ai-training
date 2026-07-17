import englishOneCloze from "../cloze/clozeData.json" with { type: "json" };
import englishOneTranslations from "../translationItems.json" with { type: "json" };
import englishOneWriting from "../writingTemplates.json" with { type: "json" };

const importedClozeModules = import.meta.glob("./cloze/{2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026}.json", {
  eager: true,
  import: "default",
});
const importedTranslationModules = import.meta.glob("./translation/{2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026}.json", {
  eager: true,
  import: "default",
});
const importedWritingModules = import.meta.glob("./writing/{2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026}.json", {
  eager: true,
  import: "default",
});

const importedEnglishIICloze = Object.values(importedClozeModules).sort((left, right) => right.year - left.year);
const importedEnglishIITranslations = Object.values(importedTranslationModules).sort((left, right) => right.year - left.year);
const importedEnglishIIWriting = Object.values(importedWritingModules).sort((left, right) => right.year - left.year);

const unifiedYears = new Set([2007, 2008, 2009]);

function asUnifiedExam(item, module) {
  return {
    ...item,
    id: "english2-unified-" + module + "-" + item.year,
    paper: "英语二",
    sourceType: "分卷前统一卷",
    compatibilityNote: "2007—2009 年未区分英语一、英语二；该练习使用当年统一卷内容。",
  };
}

const englishTwo2010ClozeChoices = [
  [{ A: "criticized", B: "appointed", C: "commented", D: "designated" }, "D"],
  [{ A: "proceeded", B: "activated", C: "followed", D: "prompted" }, "C"],
  [{ A: "digits", B: "numbers", C: "amounts", D: "sums" }, "B"],
  [{ A: "moderate", B: "normal", C: "unusual", D: "extreme" }, "A"],
  [{ A: "with", B: "in", C: "from", D: "by" }, "A"],
  [{ A: "progress", B: "absence", C: "presence", D: "favor" }, "B"],
  [{ A: "reality", B: "phenomenon", C: "concept", D: "notice" }, "D"],
  [{ A: "over", B: "for", C: "among", D: "to" }, "C"],
  [{ A: "stay up", B: "crop up", C: "fill up", D: "cover up" }, "B"],
  [{ A: "as", B: "if", C: "unless", D: "until" }, "A"],
  [{ A: "excessive", B: "enormous", C: "significant", D: "magnificent" }, "C"],
  [{ A: "categories", B: "examples", C: "patterns", D: "samples" }, "D"],
  [{ A: "imparted", B: "immersed", C: "injected", D: "infected" }, "D"],
  [{ A: "released", B: "relayed", C: "relieved", D: "remained" }, "A"],
  [{ A: "placing", B: "delivering", C: "taking", D: "giving" }, "C"],
  [{ A: "feasible", B: "available", C: "reliable", D: "applicable" }, "B"],
  [{ A: "prevalent", B: "principal", C: "innovative", D: "initial" }, "D"],
  [{ A: "presented", B: "restricted", C: "recommended", D: "introduced" }, "C"],
  [{ A: "problems", B: "issues", C: "agonies", D: "sufferings" }, "A"],
  [{ A: "involved in", B: "caring for", C: "concerned with", D: "warding off" }, "B"],
];

const englishTwo2010Cloze = {
  id: "2010-english2-cloze",
  year: 2010,
  paper: "英语二",
  title: "完形填空",
  sourceType: "真题",
  estimatedTime: 15,
  focusPoints: ["词义辨析", "固定搭配", "上下文逻辑", "语篇衔接"],
  passageParts: [
    { type: "text", content: "The outbreak of swine flu that was first detected in Mexico was declared a global epidemic on June 11, 2009. It is the first worldwide epidemic " }, { type: "blank", blankId: 1 },
    { type: "text", content: " by the World Health Organization in 41 years. The heightened alert " }, { type: "blank", blankId: 2 },
    { type: "text", content: " an emergency meeting with flu experts in Geneva that assembled after a sharp rise in cases in Australia, and rising " }, { type: "blank", blankId: 3 },
    { type: "text", content: " in Britain, Japan, Chile and elsewhere. But the epidemic is ‘" }, { type: "blank", blankId: 4 },
    { type: "text", content: "’ in severity, according to Margaret Chan, the organization’s director general, " }, { type: "blank", blankId: 5 },
    { type: "text", content: " the overwhelming majority of patients experiencing only mild symptoms and a full recovery, often in the " }, { type: "blank", blankId: 6 },
    { type: "text", content: " of any medical treatment. The outbreak came to global " }, { type: "blank", blankId: 7 },
    { type: "text", content: " in late April 2009, when Mexican authorities noted an unusually large number of hospitalizations and deaths " }, { type: "blank", blankId: 8 },
    { type: "text", content: " healthy adults. As much of Mexico City shut down at the height of a panic, cases began to " }, { type: "blank", blankId: 9 },
    { type: "text", content: " in New York City, the southwestern United States and around the world. In the United States, new cases seemed to fade " }, { type: "blank", blankId: 10 },
    { type: "text", content: " warmer weather arrived. But in late September 2009, officials reported there was " }, { type: "blank", blankId: 11 },
    { type: "text", content: " flu activity in almost every state and that virtually all the " }, { type: "blank", blankId: 12 },
    { type: "text", content: " tested are the new swine flu. In the U.S., it has " }, { type: "blank", blankId: 13 },
    { type: "text", content: " more than one million people, and caused more than 600 deaths and more than 6,000 hospitalizations. Federal health officials " }, { type: "blank", blankId: 14 },
    { type: "text", content: " Tamiflu for children from the national stockpile and began " }, { type: "blank", blankId: 15 },
    { type: "text", content: " orders from the states for the new swine flu vaccine. The new vaccine is " }, { type: "blank", blankId: 16 },
    { type: "text", content: " ahead of expectations. More than three million doses were to be made available in early October 2009, though most of those " }, { type: "blank", blankId: 17 },
    { type: "text", content: " doses were of the FluMist nasal spray type, which is not " }, { type: "blank", blankId: 18 },
    { type: "text", content: " for pregnant women, people over 50 or those with breathing difficulties, heart disease or several other " }, { type: "blank", blankId: 19 },
    { type: "text", content: ". But it was still possible to vaccinate people in other high-risk groups: health care workers, people " }, { type: "blank", blankId: 20 },
    { type: "text", content: " infants and healthy young people." }
  ],
  blanks: englishTwo2010ClozeChoices.map(([options, answer], index) => ({
    id: index + 1,
    options,
    answer,
    type: index === 2 || index === 10 || index === 11 ? "词义辨析" : "固定搭配",
    explanation: "提交后核对正确选项，并回到上下文判断搭配和语义。",
    commonMistake: "只看单个选项词义，忽略句子搭配和上下文逻辑。",
  })),
};

export const englishIIClozeItems = englishOneCloze
  .filter((item) => unifiedYears.has(item.year))
  .map((item) => asUnifiedExam(item, "cloze"))
  .concat([englishTwo2010Cloze, ...importedEnglishIICloze]);

export const englishIITranslationItems = englishOneTranslations
  .filter((item) => unifiedYears.has(item.year))
  .map((item) => asUnifiedExam(item, "translation"))
  .concat([
    {
      id: "2010-english2-translation",
      year: 2010,
      paper: "英语二",
      sourceType: "真题",
      items: [
        {
          id: "2010-english2-translation-46",
          sourceText: "“Sustainability” has become a popular word these days, but to Ted Ning, the concept will always have personal meaning. Having endured a painful period of unsustainability in his own life made it clear to him that sustainability-oriented values must be expressed through everyday action and choice. Ning recalls spending a confusing year in the late 1990s selling insurance. He had been through the dot-com boom and burst and, desperate for a job, signed on with a Boulder agency. It did not go well.",
          referenceTranslation: "“可持续性”近来已成为一个流行词，但对泰德·宁而言，这个概念始终具有个人意义。他亲历过一段难以持续的痛苦生活，因此清楚地认识到，面向可持续性的价值观必须体现在日常的行动和选择中。宁回忆起上世纪九十年代末卖保险时度过的一段迷茫岁月：他经历了互联网热潮的兴起与破灭，急于找到工作，便与博尔德的一家代理机构签了约，但事情并不顺利。",
          keyPoints: ["sustainability-oriented values 译为“面向可持续性的价值观”", "Having endured... 作主语，按汉语顺序处理", "signed on with 表示“与……签约/受雇于……”"],
          phrases: [
            { "phrase": "endure a painful period", "meaning": "经历一段痛苦时期", "example": "" },
            { "phrase": "express through", "meaning": "通过……体现", "example": "" },
            { "phrase": "sign on with", "meaning": "与……签约；受雇于", "example": "" }
          ],
          sentenceAnalysis: [],
          commonMistakes: ["不要把 sustainability 机械译为“坚持不懈”", "注意 Having endured... 的逻辑主语是后面的经历这一整体"]
        }
      ]
    }
  ].concat(importedEnglishIITranslations));

export const englishIIWritingItems = englishOneWriting
  .filter((item) => unifiedYears.has(item.year))
  .map((item) => asUnifiedExam(item, "writing"))
  .concat([
    {
      id: "2010-english2-writing",
      year: 2010,
      paper: "英语二",
      sourceType: "真题",
      smallWriting: {
        prompt: "You have just come back from the U.S. as a member of a Sino-American cultural exchange program. Write a letter to your American colleague to: 1) express your thanks for his/her warm reception; 2) welcome him/her to visit China in due course. Write about 100 words. Use “Zhang Wei” instead of your own name.",
        taskType: "感谢信",
        writingIdeas: ["致谢并说明感谢原因", "概述交流期间的收获", "邀请对方日后访问中国"],
        structure: ["称呼与致谢", "具体感谢与交流收获", "发出邀请并结尾署名"],
        usefulExpressions: ["I would like to convey my heartfelt thanks to you for...", "Your generous help made it possible for me to...", "I do hope that you will visit China one day."],
        commonMistakes: ["遗漏两项写作任务", "超过或明显少于约 100 词", "误用本人真实姓名或地址"],
        sampleEssay: ""
      },
      bigWriting: {
        prompt: "Write an essay based on the chart of mobile-phone subscriptions in developed and developing countries from 1990 to 2008. In your writing, you should: 1) interpret the chart; 2) give your comments. Write at least 150 words.",
        topic: "图表作文：移动电话订阅量",
        writingIdeas: ["描述两类国家曲线的不同变化", "解释发展中国家后期增长的可能原因", "给出趋势或影响层面的评论"],
        structure: ["首段：概述图表趋势", "中段：分组比较与原因分析", "末段：总结并作出评论"],
        usefulExpressions: ["The chart illustrates a marked contrast between...", "The figure witnessed a steady increase.", "This trend can be attributed to..."],
        commonMistakes: ["只罗列数据而没有比较", "遗漏评论要求", "把 developed / developing countries 的趋势写反"],
        sampleEssay: ""
      }
    }
  ].concat(importedEnglishIIWriting));
