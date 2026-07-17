const analysis = (sentence, coreStructure, translation, testPoint, trap, correctLogic, nextTimeStrategy) => ({
  examinerThinking: { sourceSentence: sentence, testPoint, trap, correctLogic, wrongOptionAnalysis: {}, nextTimeStrategy },
  sentenceTraining: {
    sentence,
    coreStructure,
    grammarBreakdown: "先识别主干，再根据题干关键词回到原文核对范围与语气。",
    modifiers: "结合上下文的转折、因果和限定词判断，不把局部信息扩大。",
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
    explanation: `结合句中语境，${word} 在这里表示“${meaning}”。`,
  };
});

export const readingEnhancements2012 = {
  "2012-english2-text1": {
    articleStructure: "P1 引出作业在近年受到更多批评及洛杉矶学区的新规则；P2 说明政策本意与潜在标准下调风险；P3 论证低权重会削弱学生完成作业的动力；P4-P5 指出政策回避核心问题，并建议暂缓执行。",
    structureMap: [
      { paragraph: "P1", role: "背景与政策", summary: "介绍作业争议与 LA Unified 的 10% 计分规则。" },
      { paragraph: "P2", role: "质疑", summary: "认可照顾困难学生的动机，但批评政策逻辑含混。" },
      { paragraph: "P3", role: "后果", summary: "低计分权重会让学生跳过作业，且限制教师判断。" },
      { paragraph: "P4-P5", role: "结论", summary: "应先回答作业是否有助学业，再决定保留或取消。" },
    ],
    questions: {
      "2012-english2-text1-q21": analysis("Homework has never been terribly popular with students and even many parents, but in recent years it has been particularly scorned.", "Homework has never been popular, but it has been particularly scorned.", "作业从来不太受学生和许多家长欢迎，近年尤其受到轻视和批评。", "细节题：比较级语气", "把 never popular 误读成已经不再是教育惯例，忽略 particularly scorned 的近年变化。", "A 对应 particularly scorned，说明批评增多。", "遇到 nowadays/in recent years，重点找时间变化和比较级。"),
      "2012-english2-text1-q22": analysis("This rule is meant to address the difficulty that students from impoverished or chaotic homes might have in completing their homework.", "This rule is meant to address the difficulty.", "这条规定旨在解决贫困或家庭环境混乱的学生可能难以完成作业的问题。", "细节题：目的", "把作者对政策的批评当作制定政策的直接原因。", "C 直接改写 students may have difficulty completing homework。", "目的题优先找 is meant to address、aim to 等显性表达。"),
      "2012-english2-text1-q23": analysis("With homework counting for no more than 10% of their grades, students can easily skip half their homework and see very little difference on their report cards.", "students can skip homework and see little difference", "作业只占不超过 10% 的成绩时，学生很容易少做一半作业且成绩单差别不大。", "推理题：结果", "把 report cards 的差别很小误解为学生不在乎成绩单本身。", "A 是原文对政策后果的直接推论。", "推理题要把情境和结果完整保留，别替换掉结果对象。"),
      "2012-english2-text1-q24": analysis("If the district finds homework to be unimportant to its students' academic achievement, it should move to reduce or eliminate the assignments. Conversely, if homework does contribute to student achievement, the homework should be assigned.", "if homework is unimportant...; conversely, if it contributes...", "如果作业对学业成就不重要，就应减少或取消；反过来若有贡献，就应布置并批改。", "细节题：核心争点", "把是否取消作业当成问题本身，忽略作者追问的是作业对学业成就的作用。", "B 概括 whether it counts much in schooling。", "conversely 前后通常构成同一核心问题的两个答案方向。"),
      "2012-english2-text1-q25": analysis("The homework rules should be put on hold while the school board ... looks into the matter and conducts public hearings.", "The rules should be put on hold.", "在校董会调查并举行公开听证期间，作业规则应暂缓执行。", "标题题", "只抓贫困学生或争议问题等局部信息，忽略全文批评的是政策设计失当。", "D 概括全文对这项作业政策方法的否定：它是一种有缺陷的做法。", "标题题要覆盖作者的中心评价，而不是只复制某一段主题。"),
    },
    vocabulary: vocabulary([
      ["scorn", "v./n.", "In recent years homework has been particularly scorned.", "轻视；鄙弃", "奖励；推崇", "要求；命令", "保留；维持"],
      ["district", "n.", "School districts across the country are revising their thinking.", "学区；行政区", "教师群体", "课程体系", "考试委员会"],
      ["inflexible", "adj.", "LA Unified has produced an inflexible policy.", "僵化的；不灵活的", "宽松的", "临时的", "公开的"],
      ["mandate", "v.", "The policy mandates that homework may no longer count for more than 10%.", "强制规定", "建议讨论", "允许选择", "公开解释"],
      ["exception", "n.", "With the exception of some advanced courses, homework may no longer count for more than 10%.", "例外", "原则", "结果", "条件"],
      ["impoverished", "adj.", "Students from impoverished or chaotic homes might have difficulty completing homework.", "贫困的", "富裕的", "稳定的", "偏远的"],
      ["chaotic", "adj.", "Students from impoverished or chaotic homes might have difficulty completing homework.", "混乱的", "安静的", "传统的", "严格的"],
      ["contradictory", "adj.", "But the policy is unclear and contradictory.", "相互矛盾的", "具体明确的", "广受欢迎的", "长期有效的"],
      ["essentially", "adv.", "The district is essentially giving a pass to students who do not do their homework.", "本质上；实际上", "偶然地", "公开地", "暂时地"],
      ["implication", "n.", "It is close to the implication that standards need to be lowered for poor children.", "暗示；含义", "申请；请求", "规则；条例", "结果；分数"],
      ["assign", "v.", "Teachers are allowed to assign as much of it as they want.", "布置；分配", "取消；撤回", "检查；批改", "计入；累计"],
      ["empower", "v.", "Rather than empowering teachers to find what works best for their students, the policy imposes a flat rule.", "赋权；使能够", "限制；约束", "评价；比较", "调动；替换"],
      ["impose", "v.", "The policy imposes a flat, across-the-board rule.", "强加；施加", "修订；改善", "讨论；协商", "减少；取消"],
      ["across-the-board", "adj.", "The policy imposes a flat, across-the-board rule.", "一刀切的；全面适用的", "针对个人的", "可选的", "短期试行的"],
      ["thorny", "adj.", "The policy addresses none of the truly thorny questions about homework.", "棘手的；复杂的", "简单的", "紧急的", "次要的"],
      ["achievement", "n.", "If homework does contribute to student achievement, it should be assigned.", "成就；学业表现", "出勤记录", "家庭背景", "兴趣爱好"],
      ["eliminate", "v.", "It should move to reduce or eliminate the assignments.", "取消；消除", "增加；扩大", "检查；订正", "保留；维持"],
      ["conversely", "adv.", "Conversely, if homework does contribute to student achievement, the homework should be assigned.", "相反地", "因此", "同时", "例如"],
      ["conduct", "v.", "The school board looks into the matter and conducts public hearings.", "进行；实施", "拒绝；阻止", "公布；转发", "比较；衡量"],
      ["hearing", "n.", "The school board conducts public hearings.", "听证会", "课程会议", "家长作业", "考试成绩"],
    ]),
  },
  "2012-english2-text2": {
    articleStructure: "P1 质疑粉色被过度绑定为女孩符号；P2 回溯颜色性别含义的历史变化；P3 揭示儿童发展观念受到商业营销影响；P4 说明市场细分如何放大性别差异以增加利润。",
    structureMap: [
      { paragraph: "P1", role: "提出问题", summary: "粉色只是彩虹的一小部分，却被反复绑定为女孩身份。" },
      { paragraph: "P2", role: "历史反证", summary: "粉色和蓝色的性别象征并非天生不变。" },
      { paragraph: "P3", role: "揭示原因", summary: "营销趋势塑造了人们对儿童心理发展阶段的理解。" },
      { paragraph: "P4", role: "机制与结论", summary: "市场通过更细分类别和放大性别差异来提高利润。" },
    ],
    questions: {
      "2012-english2-text2-q26": analysis("It is not that pink is intrinsically bad, but it is such a tiny slice of the rainbow and, though it may celebrate girlhood in one way, it also repeatedly and firmly fuses girls' identity to appearance.", "pink is a tiny slice ... but fuses identity to appearance", "粉色本身并非不好，但它只是彩虹中很小的一部分，且被反复与女孩的外貌身份绑定。", "推理题：转折与范围", "把作者对粉色的批评误读为完全反对粉色，忽略 tiny slice 的范围提示。", "A 表示粉色不应成为女孩身份的唯一代表。", "遇到 not that...but...，要保留作者的限定态度，避免绝对化。"),
      "2012-english2-text2-q27": analysis("Blue, with its intimations of the Virgin Mary, constancy and faithfulness, symbolised femininity.", "Blue symbolised femininity.", "蓝色因联想到圣母玛利亚、坚贞和忠诚，曾象征女性气质。", "细节题：历史事实", "只按今天的粉蓝刻板印象选项，忽略文章回溯的是历史含义。", "B 直接复述蓝色曾被视为女孩颜色。", "历史细节题要锁定时间语境，不能用当代常识替换原文。"),
      "2012-english2-text2-q28": analysis("I had not realised how profoundly marketing trends dictated our perception of what is natural to kids, including our core beliefs about their psychological development.", "marketing trends dictated our perception", "我此前没有意识到，营销趋势深刻支配了我们对儿童天性及心理发展的看法。", "细节题：同义替换", "被 researcher 或 historian 等人物信息带走，忽略段首直接给出的 marketing trends。", "A 是 marketing trends 的同义概括。", "段首总述句常直接给出作者观点，优先用其匹配抽象题干。"),
      "2012-english2-text2-q29": analysis("Splitting kids, or adults, into ever-tinier categories has proved a sure-fire way to boost profits.", "Splitting consumers into tinier categories boosts profits.", "把儿童或成人划分为越来越细的小类别，已被证明是提高利润的有效方法。", "细节题：目的与手段", "把 third stepping stone 误解为只关注两类服装，而没有抓住市场细分。", "C 对应将消费者分成更小群体。", "商业类文章要区分具体例子与其背后的盈利机制。"),
      "2012-english2-text2-q30": analysis("One of the easiest ways to segment a market is to magnify gender differences - or invent them where they did not previously exist.", "segment a market by magnifying or inventing gender differences", "划分市场最容易的方法之一，是放大性别差异，甚至凭空制造这些差异。", "主旨推断", "把粉色吸引力归因于天性或专家研究，忽略结尾的商业动机。", "C 概括商人为利润塑造并强化粉色吸引力。", "结论题优先看末段的因果总结，尤其是 profit、segment 等商业信号。"),
    },
    vocabulary: vocabulary([
      ["pervasive", "adj.", "Pink is pervasive in our young girls' lives.", "无处不在的；弥漫的", "短暂流行的", "完全隐蔽的", "严格禁止的"],
      ["intrinsically", "adv.", "It is not that pink is intrinsically bad.", "本质上；内在地", "表面上", "偶然地", "公开地"],
      ["slice", "n.", "Pink is such a tiny slice of the rainbow.", "一小部分", "完整类别", "固定规则", "显著差异"],
      ["fuse", "v.", "It repeatedly and firmly fuses girls' identity to appearance.", "使融合；紧密联系", "使分离", "使消失", "使比较"],
      ["identity", "n.", "It fuses girls' identity to appearance.", "身份；认同", "外貌；服装", "能力；成绩", "习惯；偏好"],
      ["unavoidable", "adj.", "Girls' attraction to pink may seem unavoidable.", "不可避免的", "难以解释的", "完全自然的", "可以选择的"],
      ["encode", "v.", "It may seem somehow encoded in their DNA.", "编码；写入", "遗忘；抹去", "比较；分类", "限制；禁止"],
      ["colour-coded", "adj.", "Children were not colour-coded at all until the early 20th century.", "按颜色区分的", "颜色鲜艳的", "没有颜色的", "经常改变的"],
      ["practical", "adj.", "All babies wore white as a practical matter.", "实际可行的", "审美优先的", "传统固定的", "科学证明的"],
      ["gender-neutral", "adj.", "Both boys and girls wore gender-neutral dresses.", "不区分性别的", "只适合女孩的", "只适合男孩的", "强调身份的"],
      ["masculine", "adj.", "Pink was actually considered the more masculine colour.", "男性的；阳刚的", "女性的；阴柔的", "中性的；无性别的", "幼稚的；儿童的"],
      ["intimation", "n.", "Blue, with its intimations of the Virgin Mary, symbolised femininity.", "暗示；含意", "明确命令", "市场分类", "历史事实"],
      ["femininity", "n.", "Blue symbolised femininity.", "女性气质", "男性权力", "儿童阶段", "社会地位"],
      ["amplify", "v.", "Amplifying age and sex differences became a dominant marketing strategy.", "放大；增强", "消除；减弱", "记录；保存", "解释；说明"],
      ["dominant", "adj.", "It became a dominant children's marketing strategy.", "占主导地位的", "偶然出现的", "被禁止的", "不被关注的"],
      ["dictate", "v.", "Marketing trends dictated our perception of what is natural to kids.", "支配；决定", "反映；复制", "质疑；否认", "限制；减少"],
      ["perception", "n.", "Marketing trends dictated our perception of what is natural to kids.", "看法；认知", "服装；款式", "市场；利润", "年龄；阶段"],
      ["gimmick", "n.", "It was popularised as a marketing gimmick by clothing manufacturers.", "营销噱头；花招", "科学发现", "法律规定", "教育政策"],
      ["segment", "v.", "One of the easiest ways to segment a market is to magnify gender differences.", "细分；划分", "合并；统一", "调查；评估", "扩大；增加"],
      ["sure-fire", "adj.", "Splitting consumers into ever-tinier categories has proved a sure-fire way to boost profits.", "极有把握成功的", "风险极高的", "无效过时的", "随机偶然的"],
    ]),
  },
};
