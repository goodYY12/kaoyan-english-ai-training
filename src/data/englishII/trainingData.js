import englishOneCloze from "../cloze/clozeData.json" with { type: "json" };
import englishOneTranslations from "../translationItems.json" with { type: "json" };
import englishOneWriting from "../writingTemplates.json" with { type: "json" };

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

export const englishIIClozeItems = englishOneCloze
  .filter((item) => unifiedYears.has(item.year))
  .map((item) => asUnifiedExam(item, "cloze"));

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
  ]);

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
  ]);
