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
  "2015-english2-text2": {
    articleStructure: "P1 describes the first-generation achievement paradox; P2 presents a low-cost solution; P3 gives financial-need evidence; P4 identifies a practical-knowledge gap; P5 explains institutions' role in maintaining the problem.",
    structureMap: [
      { paragraph: "P1", role: "Problem", summary: "Recruiting more first-generation students without helping them succeed can widen the class-based achievement gap." },
      { paragraph: "P2-P3", role: "Evidence and solution", summary: "A short, low-cost intervention may close much of the gap; many first-generation students also need financial support." },
      { paragraph: "P4", role: "Core cause", summary: "The central deficit is practical knowledge of navigating college, not academic potential." },
      { paragraph: "P5", role: "Institutional responsibility", summary: "Colleges rarely acknowledge class effects, leaving students without insight or guidance." },
    ],
    questions: {
      "2015-english2-text2-q26": analysis("Recruiting first-generation students, but then watching many of them fail, means that higher education has continued to reproduce and widen, rather than close, an achievement gap.", "Recruiting without support widens the gap.", "只招收第一代大学生却看着许多人失败，会使高等教育继续扩大而非缩小阶层成就差距。", "推理题：悖论", "把招募行为本身当成已经降低辍学率或缩小差距，忽略 but then watching many fail。", "D 表示该举措没有达到原本帮助学生向上流动的目的。", "遇到 paradox 时要找预期与实际结果的反差。"),
      "2015-english2-text2-q27": analysis("The article is actually quite optimistic, as it outlines a potential solution ... [a program] can close 63 percent of the achievement gap.", "A potential solution can close much of the gap.", "文章之所以乐观，是因为提出的方案能缩小 63% 的成就差距。", "细节题：因果", "把低成本误当作乐观的根本原因，或把研究结果受学生欢迎当作原文结论。", "C 的 problem is solvable 概括了存在有效解决方案。", "观点题找 as、because 后解释态度原因的内容。"),
      "2015-english2-text2-q28": analysis("Most of the first-generation students, 59.1 percent, were recipients of Pell Grants, a federal grant for undergraduates with financial need.", "Most first-generation students received need-based grants.", "59.1% 的第一代大学生获得了面向经济困难本科生的 Pell 助学金。", "细节题：数据", "把 private university 的研究样本误当作所有学生的特征，或把没有父母大学学位误解为单亲家庭。", "C 对应需要经济资助。", "比例题先看数据修饰的群体，再看括号或同位语解释其含义。"),
      "2015-english2-text2-q29": analysis("First-generation students may be most lacking not in potential but in practical knowledge about how to deal with the issues that face most college students.", "They lack practical knowledge for handling college issues.", "第一代大学生最缺的不是潜力，而是处理大学生活问题的实际知识。", "细节题：否定转折", "把 potential influence 或 research projects 等无关信息带入，忽略 not in potential but in practical knowledge。", "D 的 inexperienced in handling their issues 与原文直接同义。", "not A but B 结构的答案重点永远落在 B。"),
      "2015-english2-text2-q30": analysis("When colleges don't talk about class advantages and disadvantages ... many first-generation students lack insight about why they are struggling.", "Colleges' silence contributes to students' lack of insight.", "大学不谈论阶层带来的优势和劣势，使许多第一代大学生不明白自己为何困难、如何改善。", "推理题：责任归因", "把中产文化本身、学生个人或社会阶层当作唯一责任方，忽略 colleges don't talk 和 seldom acknowledge。", "B 表示高校对这个问题负有部分责任。", "归因题注意谁做了或没有做关键动作，机构性沉默通常构成责任。"),
    },
    vocabulary: vocabulary([
      ["first-generation", "adj.", "First-generation students do not have a parent with a college degree.", "第一代大学生的", "来自单亲家庭的", "第一年入学的", "成绩优异的"],
      ["lag", "v.", "First-generation students lag other students on achievement factors.", "落后于", "领先于", "替代；取代", "支持；帮助"],
      ["dropout", "n.", "Their dropout rates are higher.", "辍学；辍学者", "入学；录取", "奖学金；资助", "成绩；分数"],
      ["recruit", "v.", "Colleges recruit more first-generation students.", "招收；招募", "淘汰；拒绝", "评估；衡量", "资助；捐赠"],
      ["paradox", "n.", "This has created a paradox.", "矛盾现象；悖论", "直接原因", "研究结论", "解决方案"],
      ["reproduce", "v.", "Higher education can reproduce and widen an achievement gap.", "再生产；重复造成", "减少；缩小", "解释；说明", "支持；鼓励"],
      ["forthcoming", "adj.", "The paper is forthcoming in Psychological Science.", "即将出版的", "已经过时的", "广受批评的", "公开免费的"],
      ["outline", "v.", "The article outlines a potential solution.", "概述；勾勒", "拒绝；否认", "证明；确认", "限制；阻止"],
      ["intervention", "n.", "A modest intervention could have a big impact.", "干预措施", "个人选择", "研究结果", "经济困难"],
      ["recipient", "n.", "Most students were recipients of Pell Grants.", "接受者；领取者", "资助者；捐赠者", "研究者；作者", "教师；顾问"],
      ["federal", "adj.", "Pell Grants are federal grants.", "联邦的", "地方的", "私人的", "国际的"],
      ["undergraduate", "n.", "The grant is for undergraduates with financial need.", "本科生", "研究生", "大学教师", "高中学生"],
      ["thesis", "n.", "Their thesis is that a modest intervention can help.", "论点；论题", "资助；补贴", "课程；项目", "差距；障碍"],
      ["modest", "adj.", "A relatively modest intervention could have a big impact.", "适度的；不大的", "昂贵复杂的", "极端激进的", "毫无效果的"],
      ["potential", "n.", "Students may lack practical knowledge, not potential.", "潜力", "经验；技能", "资源；资金", "规则；制度"],
      ["practical", "adj.", "They lack practical knowledge about college issues.", "实际的；实用的", "纯理论的", "不重要的", "公开的"],
      ["navigate", "v.", "Students struggle to navigate the middle-class culture of higher education.", "应对；顺利通过", "拒绝；回避", "改革；推翻", "衡量；分析"],
      ["resource", "n.", "Students need to take advantage of college resources.", "资源", "障碍", "偏见", "成绩"],
      ["acknowledge", "v.", "Colleges seldom acknowledge how social class affects experience.", "承认；认可", "否认；隐瞒", "限制；阻止", "改变；改善"],
      ["insight", "n.", "Many students lack insight about why they are struggling.", "洞察；理解", "资助；补贴", "潜力；能力", "规则；政策"],
    ]),
  },
};
