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
  "2014-english2-text2": {
    articleStructure: "P1 introduces the above-average effect; P2 lists self-enhancing habits; P3 presents Epley's photograph experiment; P4 links self-enhancement with high self-esteem; P5 explains why curated social-media profiles feel appealing.",
    structureMap: [
      { paragraph: "P1", role: "Phenomenon", summary: "People systematically rate themselves above average in ways that cannot all be true." },
      { paragraph: "P2", role: "Behavior", summary: "People protect self-esteem by editing memories and judging others negatively." },
      { paragraph: "P3-P4", role: "Research evidence", summary: "The photo experiment shows that flattering self-images are intuitive and linked to higher self-esteem." },
      { paragraph: "P5", role: "Application", summary: "Facebook lets people present an idealized but not necessarily dishonest version of themselves." },
    ],
    questions: {
      "2014-english2-text2-q26": analysis("70% of us rate ourselves as above average in leadership, 93% in driving and 85% at getting on well with others, all obviously statistical impossibilities.", "The percentages cannot all be true.", "许多人都给自己打出高于平均水平的分数，但这些比例在统计上不可能同时成立。", "细节题：概括", "把 illusory superiority 当成没有根据的现象，忽略研究用统计不可能性证明的是自我评价过高。", "A 概括了人们对自己的评分不切实际地偏高。", "遇到数据例证，先把比例共同指向的结论概括出来。"),
      "2014-english2-text2-q27": analysis("Visual recognition ... is an automatic psychological process occurring rapidly and intuitively with little or no apparent conscious deliberation.", "Visual recognition occurs rapidly and intuitively.", "视觉识别是一种自动、快速且凭直觉发生的心理过程，几乎没有有意识的思考。", "细节题：同义替换", "把 automatic 理解成自动防御，或忽略 intuitively 这个直接提示。", "C 的 intuitive response 直接对应 rapidly and intuitively。", "定义题优先匹配原文中的核心属性词，而非只挑一个相同词根。"),
      "2014-english2-text2-q28": analysis("Those who thought that the images higher up the attractiveness scale were real directly corresponded with those who showed other markers for having higher self-esteem.", "Higher self-esteem corresponds with believing flattering images.", "认为更高吸引力图片是真实自己的受试者，往往也显示出更高的自尊。", "细节题：对应关系", "把没有深层不安全感误读成低估不安全感，或把抑郁信息当作结论。", "B 对应相信自己更有吸引力。", "看到 corresponded with 时，直接匹配两类人之间的对应关系。"),
      "2014-english2-text2-q29": analysis("Many people hate photographs of themselves so viscerally: on one level, they don't even recognise the person in the picture as themselves.", "Their reaction is deep and instinctive.", "许多人会本能而强烈地讨厌自己的照片，甚至不把照片中的人认作自己。", "词义题：语境推断", "把 viscerally 误选成偶尔、特别或攻击性地，没有结合后文的非理性认同障碍。", "A 的 instinctively 与深层、本能反应最接近。", "词义题用上下文的反应性质来推断，不要只依据字面联想。"),
      "2014-english2-text2-q30": analysis("Facebook ... is a self-enhancer's paradise, where people can share only the most flattering photos ... they portray an idealized version of themselves.", "People can show their flattering side and hide the rest.", "Facebook 让人们只分享最上镜的照片，呈现理想化版本的自己。", "推理题：反向表达", "把 idealized 误解为 dishonest，或只抓到智力、生活方式等列举细节。", "D 的 withhold their unflattering sides 是只展示 flattering photos 的反向改写。", "推理题注意 only、idealized 等限制词，常需要把正面展示反推为隐藏负面。"),
    },
    vocabulary: vocabulary([
      ["empirical", "adj.", "Empirical research says you think you're more beautiful than you are.", "以经验和观察为基础的", "纯理论的", "公开发表的", "统计错误的"],
      ["deep-seated", "adj.", "We have a deep-seated need to feel good about ourselves.", "根深蒂固的", "暂时出现的", "公开表达的", "刻意形成的"],
      ["self-enhancing", "adj.", "We employ self-enhancing strategies to feel good about ourselves.", "自我提升形象的", "自我否定的", "他人评价的", "数据分析的"],
      ["amass", "v.", "Social psychologists have amassed oceans of research.", "积累；聚集", "删减；放弃", "质疑；反驳", "传播；展示"],
      ["illusory", "adj.", "They call the effect illusory superiority.", "虚假的；错觉的", "稳定的；可靠的", "平均的；普通的", "正式的；合法的"],
      ["superiority", "n.", "People show an illusory sense of superiority.", "优越感；优势", "缺陷；不足", "平等；均衡", "怀疑；焦虑"],
      ["rose-tint", "v.", "We rose-tint our memories.", "美化；乐观化", "遗忘；删除", "比较；衡量", "公开；分享"],
      ["self-affirming", "adj.", "We put ourselves into self-affirming situations.", "肯定自我的", "批评自我的", "保护他人的", "限制行为的"],
      ["stereotype", "n.", "We apply negative stereotypes to others.", "刻板印象", "客观证据", "个人经历", "研究方法"],
      ["esteem", "n.", "We boost our own esteem.", "自尊；尊重", "外貌；形象", "焦虑；压力", "判断；评价"],
      ["oversaw", "v.", "Nicholas Epley oversaw a key study.", "监督；负责", "反对；拒绝", "记录；转述", "参加；申请"],
      ["lineup", "n.", "He used a lineup including altered versions of a photograph.", "一组供辨认的人或物", "研究结论", "个人档案", "排列规则"],
      ["alter", "v.", "The versions had been altered to appear more attractive.", "改变；修改", "比较；评价", "隐藏；保留", "支持；证明"],
      ["flattering", "adj.", "Subjects chose a falsely flattering image.", "使人显得更好看的；讨好的", "真实准确的", "普通平淡的", "令人失望的"],
      ["deliberation", "n.", "Visual recognition has little conscious deliberation.", "审慎考虑", "强烈反应", "公开展示", "个人偏好"],
      ["doctored", "adj.", "Participants thought positively doctored pictures were real.", "经修饰处理的", "未经修改的", "有医学问题的", "公开发布的"],
      ["profound", "adj.", "They were not making up for profound insecurities.", "深刻的；严重的", "轻微的；表面的", "公开的；明显的", "短暂的；偶然的"],
      ["depression", "n.", "If you are depressed, you won't be self-enhancing.", "抑郁；沮丧", "自信；乐观", "自尊；荣誉", "吸引力；魅力"],
      ["viscerally", "adv.", "Many people hate photographs of themselves so viscerally.", "本能地；强烈地", "偶尔地；有时", "特别地；尤其", "攻击性地；敌对"],
      ["portray", "v.", "Profiles portray an idealized version of themselves.", "描绘；呈现", "隐藏；删除", "质疑；批评", "模仿；复制"],
    ]),
  },
};
