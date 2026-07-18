const analysis = (sentence, coreStructure, translation, testPoint, trap, correctLogic, nextTimeStrategy) => ({
  examinerThinking: { sourceSentence: sentence, testPoint, trap, correctLogic, wrongOptionAnalysis: {}, nextTimeStrategy },
  sentenceTraining: {
    sentence,
    coreStructure,
    grammarBreakdown: "先确定主句的评价或结论，再看例子、让步和条件补充的信息。",
    modifiers: "重点识别 yet、particularly、if、but 等逻辑信号，避免把局部例子当成全文结论。",
    translation,
    relationToQuestion: correctLogic,
    exercises: [],
  },
});

const vocabulary = (items) => items.map(([word, partOfSpeech, sentence, meaning, wrong1, wrong2, wrong3], index) => {
  const labels = ["A", "B", "C", "D"];
  const answer = labels[index % labels.length];
  const choices = [meaning, wrong1, wrong2, wrong3];
  return {
    word,
    partOfSpeech,
    sentence,
    options: Object.fromEntries(labels.map((label, choiceIndex) => [label, choices[(choiceIndex - index % labels.length + labels.length) % labels.length]])),
    answer,
    meaningInContext: meaning,
    explanation: `结合本篇语境，${word} 在这里表示“${meaning}”。`,
  };
});

export const readingEnhancements2014 = {
  "2014-english2-text1": {
    articleStructure: "P1 uses a lottery winner to introduce Happy Money; P2 contrasts material goods with experiences; P3 gives practical spending advice; P4 evaluates the book and returns to the money-happiness link.",
    structureMap: [
      { paragraph: "P1", role: "Introduction", summary: "A lottery winner introduces the question of how money can create lasting fulfillment." },
      { paragraph: "P2", role: "Core claim", summary: "Experiences create more lasting satisfaction than material purchases." },
      { paragraph: "P3", role: "Examples and advice", summary: "Time with people, giving, and scarce luxuries produce more pleasure." },
      { paragraph: "P4", role: "Evaluation", summary: "The reviewer finds the book's central advice broadly worthwhile despite policy disagreements." },
    ],
    questions: {
      "2014-english2-text1-q21": analysis("It is far better to spend money on experiences ... like interesting trips, unique meals or even going to the cinema.", "It is far better to spend money on experiences.", "把钱花在经历上更好，例如有趣的旅行、特别的餐食或看电影。", "细节题：同义替换", "把 unique meals 机械替换成 rich meal，忽略题目问的是最有回报的消费方式。", "B 的 special tour 对应 interesting trips，属于体验型消费。", "细节题要匹配原文中心名词和例子属性，不只看相近形容词。"),
      "2014-english2-text1-q22": analysis("Most people would be better off if they could ... spend less of it watching television ... and [they are] hardly jollier for it.", "People would be better off watching less television.", "如果少看电视、多陪伴家人朋友，大多数人的生活会更好；看电视也几乎不会让人更快乐。", "态度题：评价", "只注意到美国人看电视的时间很长，却忽略 hardly jollier for it 的负面评价。", "A 表示批评，符合作者认为看电视并不会带来更多快乐。", "态度题抓带有褒贬色彩的副词、形容词和比较结构。"),
      "2014-english2-text1-q23": analysis("Luxuries are most enjoyable when they are consumed sparingly. This is apparently the reason McDonald's restricts the availability of its popular McRib.", "Luxuries are enjoyable when consumed sparingly.", "奢侈品在节制、稀少地消费时最令人愉悦；麦香猪柳包限时供应正是例证。", "例证题", "只看到 marketing trick 就选择营销有效，忽略例子前的论点句。", "D 是 consumed sparingly 与 rarity、enjoyable 与 pleasure 的同义替换。", "例证题先回到例子前一句，找它要证明的抽象观点。"),
      "2014-english2-text1-q24": analysis("Most people will come away from this book believing it was money well spent.", "Readers will think the book was money well spent.", "大多数读者读完会觉得这本书花得值。", "推理题：同义替换", "把作者承认的政策分歧误解为整本书不值得购买。", "B 的 worthwhile purchase 直接改写 money well spent。", "书评题的结尾评价通常就是作者的总体判断。"),
      "2014-english2-text1-q25": analysis("The most rewarding ways to spend money can be counterintuitive. ... [The book explains] the link between feeling good and spending money on others.", "The passage discusses money and lasting well-being.", "文章讨论如何把花钱与获得更持久的幸福感结合起来。", "主旨题", "把开头彩票故事、奢侈品建议或某一种购买方式误当作全文中心。", "A 概括全文一直讨论的 feeling good 与 spending money 的关系。", "主旨题选择覆盖全文各段、而不是只复述某一例子或对策的选项。"),
    },
    vocabulary: vocabulary([
      ["undivided", "adj.", "She collected the biggest undivided lottery jackpot in history.", "未分割的；独得的", "无法获得的", "公开宣布的", "持续增长的"],
      ["jackpot", "n.", "She collected the biggest lottery jackpot in history.", "头奖；巨额奖金", "固定工资", "慈善捐款", "家庭财产"],
      ["fortune", "n.", "Her newfound fortune may yield lasting fulfillment.", "财富；巨款", "机会；可能性", "名声；荣誉", "政策；法规"],
      ["fulfillment", "n.", "She hopes her fortune will yield lasting feelings of fulfillment.", "满足感；实现", "焦虑感；担忧", "限制；约束", "竞争；冲突"],
      ["array", "n.", "The academics use an array of behavioral research.", "一系列；大量", "单一例子", "错误结论", "固定规则"],
      ["rewarding", "adj.", "The most rewarding ways to spend money can be counterintuitive.", "值得的；有回报的", "昂贵的；奢侈的", "简单的；直接的", "危险的；不可靠的"],
      ["counterintuitive", "adj.", "The most rewarding ways to spend money can be counterintuitive.", "违反直觉的", "完全正确的", "广受欢迎的", "易于理解的"],
      ["extravagant", "adj.", "Fantasies of wealth involve extravagant homes.", "奢侈的；铺张的", "实用的；节俭的", "传统的；保守的", "普通的；平凡的"],
      ["wear off", "phr. v.", "Satisfaction with material purchases wears off fairly quickly.", "逐渐消退", "迅速增加", "长期保持", "公开展示"],
      ["regret", "n.", "Regret creeps in after material purchases lose novelty.", "后悔；遗憾", "满足；快乐", "兴趣；好奇", "信任；支持"],
      ["purchase", "n.", "These purchases often become more valuable with time.", "购买物；购买", "收入；报酬", "经历；回忆", "礼物；捐赠"],
      ["commute", "n.", "People would be better off if they could shorten their commutes.", "通勤路程", "旅行经历", "工作时间", "家庭聚会"],
      ["whopping", "adj.", "The average American spends a whopping two months a year watching television.", "惊人的；巨大的", "微小的；有限的", "平均的；普通的", "短暂的；临时的"],
      ["charity", "n.", "Giving to charity is often more pleasurable than purchasing things for oneself.", "慈善；慈善机构", "商业；贸易", "教育；培训", "政策；法规"],
      ["sparingly", "adv.", "Luxuries are most enjoyable when they are consumed sparingly.", "节制地；少量地", "公开地；正式地", "持续地；频繁地", "昂贵地；奢侈地"],
      ["restrict", "v.", "McDonald's restricts the availability of its popular McRib.", "限制；约束", "增加；扩大", "宣传；推广", "替代；更换"],
      ["obsession", "n.", "The sandwich became an object of obsession.", "痴迷；执念", "厌恶；反对", "误解；偏见", "习惯；规则"],
      ["privileged", "adj.", "Readers are clearly a privileged lot, anxious about fulfillment, not hunger.", "有特权的；优越的", "贫困的；匮乏的", "普通的；平凡的", "孤立的；无助的"],
      ["scarcity", "n.", "Scarcity enhances the pleasure of most things.", "稀缺；缺乏", "丰富；充足", "公平；平等", "需求；偏好"],
      ["mandate", "v.", "The authors' ideas range from mandating more holiday time.", "强制规定", "自愿建议", "公开反对", "详细解释"],
    ]),
  },
};
