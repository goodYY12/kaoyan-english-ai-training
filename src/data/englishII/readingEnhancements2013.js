const analysis = (sentence, coreStructure, translation, testPoint, trap, correctLogic, nextTimeStrategy) => ({
  examinerThinking: { sourceSentence: sentence, testPoint, trap, correctLogic, wrongOptionAnalysis: {}, nextTimeStrategy },
  sentenceTraining: { sentence, coreStructure, grammarBreakdown: "先找主干，再根据题干关键词核对限定范围与逻辑关系。", modifiers: "注意转折、比较和因果，不把局部现象扩大为全文结论。", translation, relationToQuestion: correctLogic, exercises: [] },
});

const vocabulary = (items) => items.map(([word, partOfSpeech, sentence, meaning, wrong1, wrong2, wrong3], index) => {
  const labels = ["A", "B", "C", "D"];
  const answer = labels[index % labels.length];
  const choices = [meaning, wrong1, wrong2, wrong3];
  return { word, partOfSpeech, sentence, options: Object.fromEntries(labels.map((label, choiceIndex) => [label, choices[(choiceIndex - index % labels.length + labels.length) % labels.length]])), answer, meaningInContext: meaning, explanation: `结合句中语境，${word} 在这里表示“${meaning}”。` };
});

export const readingEnhancements2013 = {
  "2013-english2-text1": {
    articleStructure: "P1 用纺织厂笑话引出自动化；P2 分析失业与收入下降的多重原因；P3 提出“平庸时代结束”和独特价值；P4-P5 用制造业与技术变化论证；P6 落到普及高等教育的政策建议。",
    structureMap: [
      { paragraph: "P1", role: "引入", summary: "自动化让纺织厂只剩一人一狗的笑话。" },
      { paragraph: "P2", role: "背景", summary: "衰退、全球化和信息技术共同替代劳动力。" },
      { paragraph: "P3", role: "核心观点", summary: "普通技能与普通工作已不足，员工需创造独特价值。" },
      { paragraph: "P4-P6", role: "论证与建议", summary: "技术替代加速，优质岗位要求更多教育，教育是应对就业的关键。" },
    ],
    questions: {
      "2013-english2-text1-q21": analysis("The average mill has only two employees today, a man and a dog. The man is there to feed the dog, and the dog is there to keep the man away from the machines.", "The mill has only two employees.", "如今普通纺织厂只剩一人一狗：人喂狗，狗防止人靠近机器。", "例证题", "把笑话当作纺织厂规模缩小，而忽略机器替代人的讽刺。", "A 指向技术进步和自动化对劳动的冲击。", "例子题先问例子服务于什么中心现象，而非逐字复述。"),
      "2013-english2-text1-q22": analysis("Everyone needs to find their extra - their unique value contribution that makes them stand out in whatever is their field of employment.", "Everyone needs to find their unique value contribution.", "每个人都需要找到自己的额外价值，也就是能使其在职场脱颖而出的独特贡献。", "细节题：同义替换", "只看到 cheap labor/software 等背景词，忽略 therefore 后的结论。", "D 直接改写 unique value contribution。", "therefore 后常承接作者的对策或答案落点。"),
      "2013-english2-text1-q23": analysis("Factories shed workers so fast that they erased almost all the gains of the previous 70 years.", "Factories shed workers so fast.", "工厂裁员速度极快，几乎抹去了此前七十年的就业增长成果。", "细节题：程度", "把 gains 被抹去理解成技术收益消失，而非就业岗位消失。", "B 概括岗位以极快速度消失。", "数字和比喻常服务于强调速度与规模，先判断被修饰对象。"),
      "2013-english2-text1-q24": analysis("Nothing would be more important than passing some kind of G.I. Bill for the 21st century that ensures that every American has access to post-high school education.", "Nothing would be more important than ensuring access to education.", "没有什么比让每个美国人都能接受高中后教育更重要。", "细节题：最高级", "被 globalization 或 I.T. 的背景信息干扰，忽略 nothing more important 的政策落点。", "B 对应确保更多人获得教育。", "最高级与否定比较结构常直接给出作者最重要的建议。"),
      "2013-english2-text1-q25": analysis("Today, average is officially over.", "Average is over.", "今天，靠普通技能和普通工作维持生活的时代正式结束。", "标题题", "只选技术、衰退或法案等局部信息，没有涵盖全文反复强调的核心判断。", "C 是贯穿全文的中心命题。", "标题题优先选被反复提出、并能统领例证与建议的表达。"),
    },
    vocabulary: vocabulary([
      ["textile", "adj.", "A modern textile mill has been automated.", "纺织的", "农业的", "金融的", "电子的"],
      ["automate", "v.", "A modern textile mill has been automated.", "使自动化", "使全球化", "使商业化", "使标准化"],
      ["stubbornly", "adv.", "We have such stubbornly high unemployment.", "顽固地；持续不变地", "迅速地", "偶然地", "公开地"],
      ["sagging", "adj.", "Middle-class incomes are sagging.", "下滑的；疲软的", "上涨的；强劲的", "稳定的；不变的", "平均的；普通的"],
      ["recession", "n.", "Demand dropped because of the Great Recession.", "经济衰退", "经济繁荣", "产业升级", "收入分配"],
      ["globalization", "n.", "Advances in globalization are replacing labor.", "全球化", "自动化", "城市化", "私有化"],
      ["replace", "v.", "Machines replace labor with foreign workers.", "替代", "保护", "培训", "奖励"],
      ["average", "adj.", "Workers with average skills could earn an average lifestyle.", "普通的；平均的", "独特的；突出的", "昂贵的；高端的", "灵活的；可变的"],
      ["access", "n.", "Employers have access to cheap foreign labor.", "获得机会；接触途径", "排斥；限制", "收入；报酬", "资格；学历"],
      ["robotics", "n.", "Employers have access to cheap robotics.", "机器人技术", "软件行业", "教育系统", "医疗服务"],
      ["contribution", "n.", "Find their unique value contribution.", "贡献；价值投入", "薪水；报酬", "职位；岗位", "能力；学历"],
      ["stand out", "phr. v.", "Unique value makes them stand out in employment.", "脱颖而出", "逐渐消失", "保持平均", "承担风险"],
      ["acceleration", "n.", "There has been an acceleration.", "加速", "倒退", "停滞", "平衡"],
      ["shed", "v.", "Factories shed workers so fast.", "裁减；摆脱", "雇用；增加", "培训；提升", "保护；维持"],
      ["manufacturing", "n.", "Automation is not just coming to manufacturing.", "制造业", "服务业", "金融业", "教育业"],
      ["transformation", "n.", "Siri is the beginning of a huge transformation.", "巨大变革", "短期调整", "经济衰退", "政策限制"],
      ["interact", "v.", "How we interact with banks and health care providers.", "互动；相互作用", "竞争；对抗", "取代；淘汰", "调查；评估"],
      ["buttress", "v.", "We need to buttress employment.", "支持；加强", "削弱；破坏", "取代；更新", "衡量；计算"],
      ["ensure", "v.", "The bill ensures access to post-high school education.", "确保", "限制", "预测", "拒绝"],
      ["post-high school", "adj.", "Every American has access to post-high school education.", "高中后的", "高中以前的", "职业培训的", "大学内部的"],
    ]),
  },
};
