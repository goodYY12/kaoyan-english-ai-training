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
      "2012-english2-text1-q25": analysis("The homework rules should be put on hold while the school board ... looks into the matter and conducts public hearings.", "The rules should be put on hold.", "在校董会调查并举行公开听证期间，作业规则应暂缓执行。", "标题题", "只抓贫困学生或争议问题等局部信息，忽略全文批评的是政策设计失当。", "D 概括作者认为该教育政策被错误解读和执行。", "标题题要覆盖作者的中心评价，而不是只复制某一段主题。"),
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
};
