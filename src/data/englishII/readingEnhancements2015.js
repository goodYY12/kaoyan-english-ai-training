const analysis = (sentence, coreStructure, translation, testPoint, trap, correctLogic, nextTimeStrategy) => ({
  examinerThinking: { sourceSentence: sentence, testPoint, trap, correctLogic, wrongOptionAnalysis: {}, nextTimeStrategy },
  sentenceTraining: {
    sentence,
    coreStructure,
    grammarBreakdown: "先找句子的主结论，再判断转折、比较和例外条件如何限定它。",
    modifiers: "注意 contrary to、not、but、however 等反向和对比信号，区分原调查与新研究结论。",
    translation,
    relationToQuestion: correctLogic,
    exercises: [],
  },
});

const vocabulary = (items) => items.map(([word, partOfSpeech, sentence, meaning, wrong1, wrong2, wrong3], index) => {
  const labels = ["A", "B", "C", "D"];
  const answer = labels[index % labels.length];
  const choices = [meaning, wrong1, wrong2, wrong3];
  return { word, partOfSpeech, sentence, options: Object.fromEntries(labels.map((label, choiceIndex) => [label, choices[(choiceIndex - index % labels.length + labels.length) % labels.length]])), answer, meaningInContext: meaning, explanation: `结合本篇语境，${word} 在这里表示“${meaning}”。` };
});

export const readingEnhancements2015 = {
  "2015-english2-text1": {
    articleStructure: "P1 overturns the belief that home is less stressful; P2 explains women's double burden; P3 contrasts clear workplace bargains with home life; P4-P5 show why household labor is hard to organize and motivate.",
    structureMap: [
      { paragraph: "P1", role: "Unexpected finding", summary: "Stress markers are higher at home, contrary to most surveys." },
      { paragraph: "P2", role: "Gender explanation", summary: "Working women often combine paid work with household catch-up tasks." },
      { paragraph: "P3", role: "Comparison", summary: "Work has clear tasks and rewards, unlike the home front." },
      { paragraph: "P4-P5", role: "Conclusion", summary: "Household labor is endless, poorly rewarded, and difficult to motivate." },
    ],
    questions: {
      "2015-english2-text1-q21": analysis("Contrary to most surveys, people are actually more stressed at home than at work.", "The new finding is contrary to most surveys.", "新研究发现人们在家压力更大，这与大多数旧调查的结论相反。", "细节题：反向关系", "直接选择新研究的结论，忽略题干问的是 most previous surveys。", "A 对应旧调查认为家比工作场所更放松。", "看到 contrary to 时，先把新旧两套结论分开，再按题干要求作答。"),
      "2015-english2-text1-q22": analysis("It is men, not women, who report being happier at home than at work. ... [The finding holds] more so for nonparents.", "Men and nonparents are more likely to report happiness at home.", "报告在家比工作更快乐的是男性；这一趋势在没有孩子的人中更明显。", "细节题：交叉条件", "只抓 men 或 nonparents 其中一个条件，忽略题目问的是最可能的一类人。", "C 的 childless husbands 同时满足男性和无子女两个条件。", "多条件题把人物特征逐一交叉，避免只匹配半个条件。"),
      "2015-english2-text1-q23": analysis("For women who work outside the home, they often are playing catch-up with household tasks. With the blurring of roles ... women are more stressed at home.", "Working women combine paid work and housework.", "外出工作的女性仍需补做家务，因此同时承担挣钱者和家庭主妇两种角色。", "细节题：概括", "把 leave the office、kick back 等局部表达当作角色模糊的定义。", "D 准确概括了既是 breadwinners 又是 housewives 的双重身份。", "概念题优先用上下文多个例子归纳定义，不要照搬单句。"),
      "2015-english2-text1-q24": analysis("Employee puts in hours of physical or mental labor and employee draws out life-sustaining moola.", "Labor is exchanged for income.", "员工投入体力或脑力劳动，换取维持生活的钱。", "词义题：语境替换", "把 life-sustaining 误理解成营养或能量，忽略 draw an income 的同义提示。", "C 的 earnings 与 income/moola 对应。", "俚语词义先找同段的正式同义表达，往往比字面更可靠。"),
      "2015-english2-text1-q25": analysis("Rare is the household in which the division of labor is so clinically and methodically laid out.", "Division of labor at home is rarely clear and systematic.", "很少有家庭能把劳动分工安排得如此清楚、有条理。", "细节题：否定表达", "被 cozier、motivating、adequately rewarded 等带有正面色彩的词干扰，忽略文中 no such clarity 和 inadequate rewards。", "A 对应家庭劳动分工很少清晰明确。", "倒装句 Rare is... 的重点是 rare，转写时要保留否定频率。"),
    },
    vocabulary: vocabulary([
      ["contrary to", "phr.", "Contrary to most surveys, people are more stressed at home.", "与...相反", "支持；赞同", "依赖；根据", "导致；造成"],
      ["cortisol", "n.", "Researchers measured people's cortisol, which is a stress marker.", "皮质醇；压力指标", "心理状态", "家庭劳动", "工资收入"],
      ["refuge", "n.", "Home is supposed to be a place of refuge.", "避难处；庇护所", "工作场所", "竞争环境", "公共机构"],
      ["conventional wisdom", "n. phr.", "The findings contradict conventional wisdom.", "传统看法；常识", "科学实验", "政策规定", "个人经历"],
      ["nonparent", "n.", "The findings hold more so for nonparents.", "无子女的人", "单亲家长", "家庭成员", "工作父母"],
      ["measure", "v.", "The study doesn't measure whether people are still doing work at home.", "测量；衡量", "解决；处理", "限制；禁止", "证明；确认"],
      ["kick back", "phr. v.", "For many men, the end of the workday is a time to kick back.", "放松；休息", "返回；退回", "加快；推进", "反驳；拒绝"],
      ["catch-up", "n.", "Women often are playing catch-up with household tasks.", "补做；赶上", "放弃；停止", "计划；安排", "分享；分担"],
      ["blurring", "n.", "With the blurring of roles, women are more stressed at home.", "界限模糊", "明确分工", "角色冲突", "任务增加"],
      ["lag behind", "phr. v.", "The home front lags behind the workplace in making adjustments.", "落后于", "领先于", "取代；替换", "依赖于"],
      ["bargain", "n.", "The bargain is very pure: labor is exchanged for income.", "交易；交换关系", "便宜商品", "争议；冲突", "工资水平"],
      ["draw an income", "phr.", "People work in order to draw an income.", "获得收入", "支付费用", "减少债务", "争取机会"],
      ["moola", "n.", "Employee draws out life-sustaining moola.", "钱；收入", "技能；能力", "能量；精力", "营养；食物"],
      ["clarity", "n.", "On the home front, people have no such clarity.", "清晰；明确", "压力；焦虑", "回报；奖励", "能力；资格"],
      ["clinically", "adv.", "Division of labor is clinically and methodically laid out.", "有条理地；客观地", "随意地；偶然地", "公开地；正式地", "情绪化地；主观地"],
      ["methodically", "adv.", "Division of labor is methodically laid out.", "有方法地；系统地", "仓促地；随意地", "公开地；明显地", "秘密地；私下地"],
      ["inadequate", "adj.", "There are inadequate rewards for most tasks.", "不足的；不充分的", "充足的；丰富的", "公平的；合理的", "明确的；固定的"],
      ["colleague", "n.", "Your home colleagues, your family, have no clear rewards.", "同事；共事者", "亲属；父母", "顾客；客户", "上司；老板"],
      ["motivate", "v.", "The co-workers are much harder to motivate.", "激励；促使", "限制；阻止", "评估；判断", "惩罚；批评"],
      ["infinite", "adj.", "The tasks are apparently infinite.", "无穷无尽的", "有限可控的", "清晰明确的", "轻松简单的"],
    ]),
  },
};
