const analysis = (sentence, core, translation, testPoint, trap, logic, strategy) => ({
  examinerThinking: { sourceSentence: sentence, testPoint, trap, correctLogic: logic, wrongOptionAnalysis: {}, nextTimeStrategy: strategy },
  sentenceTraining: { sentence, coreStructure: core, grammarBreakdown: "先锁定主干，再核对题干关键词与原文范围。", modifiers: "结合定位句中的修饰成分与逻辑词复盘。", translation, relationToQuestion: logic, exercises: [] },
});

const vocabulary = (items) => items.map(([word, partOfSpeech, sentence, meaning, distractor1, distractor2, distractor3], index) => {
  const labels = ["A", "B", "C", "D"];
  const answer = labels[index % labels.length];
  const choices = [meaning, distractor1, distractor2, distractor3];
  return {
    word,
    partOfSpeech,
    sentence,
    options: Object.fromEntries(labels.map((label, choiceIndex) => [label, choices[(choiceIndex - (index % labels.length) + labels.length) % labels.length]])),
    answer,
    meaningInContext: meaning,
    explanation: `结合句中语境，${word} 在这里表示“${meaning}”。`,
  };
});

export const readingEnhancements2011 = {
  "2011-english2-text1": {
    articleStructure: "P1 以 Simmons 的经历引出独立董事问责；P2 说明独立董事的理想职责；P3 用研究呈现突然离职与企业风险的关系；P4 分析董事提前离职的声誉动机及企业应对。",
    structureMap: [{ paragraph: "P1", role: "引入", summary: "由高盛独立董事争议引出话题。" }, { paragraph: "P2", role: "定义", summary: "说明独立董事应当独立、少偏见。" }, { paragraph: "P3", role: "研究证据", summary: "突然离职与公司后续负面表现相关。" }, { paragraph: "P4", role: "推论", summary: "企业需要激励机制以留住董事。" }],
    vocabulary: vocabulary([
      ["outside director", "n.", "Ruth Simmons joined Goldman Sachs's board as an outside director in January 2000.", "外部董事；独立董事", "执行董事", "股东", "审计师"],
      ["apparently", "adv.", "She apparently managed both roles without attracting much criticism.", "显然；看来", "故意地", "永久地", "公开地"],
      ["under fire", "phr.", "Ms. Simmons was under fire for having sat on Goldman's compensation committee.", "受到批评；遭到抨击", "正在升职", "获得支持", "接受培训"],
      ["compensation", "n.", "Ms. Simmons had sat on Goldman's compensation committee.", "薪酬；补偿", "竞争", "承诺", "股份"],
      ["payout", "n.", "How could she have let those enormous bonus payouts pass unremarked?", "支付的款项", "税收减免", "投资损失", "债务总额"],
      ["unremarked", "adj.", "How could she have let those enormous bonus payouts pass unremarked?", "未被注意到的", "备受赞扬的", "被合法批准的", "被公开披露的"],
      ["biased", "adj.", "Outside directors are supposed to serve as helpful, yet less biased, advisers.", "有偏见的", "独立的", "专业的", "保守的"],
      ["reputation", "n.", "Having made their wealth and their reputations elsewhere.", "声誉；名望", "薪酬", "职责", "风险"],
      ["independence", "n.", "They presumably have enough independence to disagree with the chief executive's proposals.", "独立性", "经验", "权力", "财富"],
      ["proposal", "n.", "They may disagree with the chief executive's proposals.", "提议；方案", "利润", "危机", "报表"],
      ["weather", "v.", "They should be able to give advice based on having weathered their own crises.", "经受住；熬过", "预测", "扩大", "回避"],
      ["proxy statement", "n.", "They checked which directors stayed from one proxy statement to the next.", "委托书；股东大会文件", "财务报表", "法律诉状", "董事薪酬"],
      ["depart", "v.", "The most likely reason for departing a board was age.", "离开；辞去", "加入", "监督", "提议"],
      ["subsequently", "adv.", "The company will subsequently have to restate earnings.", "随后；其后", "故意地", "公开地", "偶然地"],
      ["restate", "v.", "The company will subsequently have to restate earnings.", "重新陈述；重报", "增加", "隐瞒", "分配"],
      ["class-action lawsuit", "n.", "The likelihood of being named in a federal class-action lawsuit also increases.", "集体诉讼", "商业合并", "董事会议", "税务审查"],
      ["correlation", "n.", "A correlation between them leaving and subsequent bad performance is suggestive.", "相关性", "因果关系", "冲突", "补偿"],
      ["suggestive", "adj.", "The correlation is suggestive, it does not mean that such directors are always jumping off a sinking ship.", "具有启发性但非定论的", "毫无价值的", "绝对正确的", "违法的"],
      ["incentive", "n.", "Firms may have to create incentives.", "激励；激励措施", "限制", "处罚", "义务"],
      ["otherwise", "adv.", "Otherwise outside directors will follow the example of Ms. Simmons.", "否则", "同样地", "尤其是", "立即"],
    ]),
    questions: {
      "2011-english2-text1-q21": analysis("Ms. Simmons was under fire for having sat on Goldman's compensation committee; how could she have let those enormous bonus payouts pass unremarked?", "Ms. Simmons was under fire", "Simmons 因任职薪酬委员会且未关注巨额奖金而受批评。", "细节题：职责", "把奖金数额误作她本人获利。", "B 对应没有履行监督职责。", "人物评价题看批评的具体行为，不把背景事实当答案。"),
      "2011-english2-text1-q22": analysis("Outside directors are supposed to serve as helpful, yet less biased, advisers on a firm's board.", "Outside directors are supposed to serve as advisers", "独立董事应当担任有帮助且偏见较少的顾问。", "细节题：同义替换", "把 less biased 偷换为完全 unbiased，或把 adviser 偷换为 executive。", "D 与原文 independent advisers 同义。", "限定词 less 不等于完全没有；职位名要按原文核对。"),
      "2011-english2-text1-q23": analysis("The likelihood of being named in a federal class-action lawsuit also increases, and the stock is likely to perform worse.", "the stock is likely to perform worse", "公司股票很可能表现更差。", "细节题：并列信息", "把 restate earnings 的概率上升误读为 earnings 上升。", "C 直接对应 stock perform worse。", "数字和概率先找主语，避免把“概率增加”读成“收入增加”。"),
      "2011-english2-text1-q24": analysis("Firms who want to keep their outside directors through tough times may have to create incentives.", "Firms may have to create incentives", "想在困难时期留住独立董事的公司可能必须提供激励。", "推理题：条件结果", "把董事离职动机推成已有不当记录，或误判其会拒绝激励。", "A 是“create incentives”带来的合理推论。", "推理题只延伸一个逻辑台阶，优先选择被原文条件直接支持的结果。"),
      "2011-english2-text1-q25": analysis("Outside directors are supposed to serve as helpful, yet less biased, advisers on a firm's board.", "Outside directors are supposed to serve as helpful advisers", "独立董事本应成为有帮助、较少偏见的顾问。", "态度题", "把对个别离职现象的描述误当成作者否定整个角色。", "B 与作者对制度角色的肯定性表述一致。", "态度题区分“对现实问题的担忧”和“对制度功能的总体态度”。"),
    },
  },
  "2011-english2-text2": {
    articleStructure: "P1 回顾报业濒危论；P2 指出危机并未如预想严重；P3 说明裁员、缩版等自救措施；P4 比较收入结构；P5 总结报纸应突出自身特色。",
    structureMap: [{ paragraph: "P1", role: "背景", summary: "报业曾被认为走向衰亡。" }, { paragraph: "P2", role: "转折", summary: "多国报纸仍存活并盈利。" }, { paragraph: "P3-P4", role: "论证", summary: "报业通过降本和调整收入结构维持生存。" }, { paragraph: "P5", role: "结论", summary: "完整性不再关键，差异化更重要。" }],
    questions: {
      "2011-english2-text2-q26": analysis("Newspapers like the San Francisco Chronicle were chronicling their own doom.", "newspapers were chronicling their doom", "报纸仿佛在记录自己的厄运。", "词义题：语境", "只看报纸名称，忽略 doom 的负面语气。", "D 概括其处于绝境。", "陌生表达先抓评价词的褒贬色彩。"),
      "2011-english2-text2-q27": analysis("Some papers even had the nerve to refuse delivery to distant suburbs.", "papers refused delivery", "一些报纸甚至拒绝向偏远郊区投递。", "推理题：措施目的", "孤立理解拒投行为，没有联系裁员、缩版等同段措施。", "B 与整段共同目的“压缩成本”一致。", "原因未直说时，向前找同类措施的共同目标。"),
      "2011-english2-text2-q28": analysis("Fully 87% of their revenues came from advertising in 2008. In Japan the proportion is 35%.", "87% versus 35% came from advertising", "美国广告收入占 87%，日本仅占 35%。", "推理题：数据比较", "误把收入来源更均衡理解为来源更多。", "C 由广告占比更低推出依赖更小。", "比较题先确认比较维度，再做最小化推论。"),
      "2011-english2-text2-q29": analysis("Much of the damage has been concentrated in areas where newspapers are least distinctive.", "damage has been concentrated in least distinctive areas", "损失主要集中在报纸最缺少特色的领域。", "推理题：观点", "把栏目消失直接推成读者失去兴趣。", "A 概括了作者强调差异化的立场。", "推论选项要能解释段落中心句，而非抓单一例子。"),
      "2011-english2-text2-q30": analysis("Newspapers are becoming more balanced businesses, with a healthier mix of revenues.", "Newspapers are becoming more balanced businesses", "报纸正成为收入结构更健康、更平衡的企业。", "主旨题", "只看首段危机，忽略后文复苏和调整。", "A 同时保留困境与求生过程，覆盖全文。", "标题题用首尾段校验，避免选过度乐观或绝望的绝对项。"),
    },
  },
  "2011-english2-text3": {
    articleStructure: "P1-P2 交代战后住宅审美；P3-P5 说明 Mies 与“少即是多”；P6-P7 展示美国本土的简约住宅实践。",
    structureMap: [{ paragraph: "P1-P2", role: "背景", summary: "战后克制与对未来的信心塑造住宅风格。" }, { paragraph: "P3-P5", role: "核心论证", summary: "Mies 的简约理念影响美国建筑。" }, { paragraph: "P6-P7", role: "补充例证", summary: "本土建筑师和案例住宅延续该趋势。" }],
    questions: {
      "2011-english2-text3-q31": analysis("That restraint, in combination with the postwar confidence in the future, made small, efficient housing positively stylish.", "restraint and confidence made housing stylish", "克制与战后对未来的信心使小而高效的住房成为时尚。", "细节题", "把住房形式误当作唯一答案，忽略其反映的价值。", "C 直接复现 restraint 和 confidence。", "抽象概括题优先找原文并列的核心名词。"),
      "2011-english2-text3-q32": analysis("These designers came to exert enormous influence on the course of American architecture.", "designers exerted influence", "这些设计师对美国建筑发展产生巨大影响。", "推理题", "把 Mies 与 Bauhaus 的关联误作创办关系。", "D 是文中影响力的直接概括。", "机构题避免把关联、移民或任教扩展为创办。"),
      "2011-english2-text3-q33": analysis("Elegance, he believed, did not derive from abundance.", "Elegance did not derive from abundance", "他认为优雅并不来自繁冗。", "细节题：否定", "把“少即是多”误读为空旷或大空间。", "C 与 not derive from abundance 同义。", "否定句优先找反义替换。"),
      "2011-english2-text3-q34": analysis("The elegance of the buildings' details and proportions, the architectural equivalent of the abstract art.", "details and proportions were equivalent to abstract art", "建筑细节和比例的优雅，相当于当时流行的抽象艺术。", "细节题：同义替换", "忽略 smaller，或把 abstract art 的类比误作材料流行。", "D 概括了与抽象艺术的共同特征。", "比喻或类比后常是正确选项的改写来源。"),
      "2011-english2-text3-q35": analysis("Aesthetic effect came from the landscape, new materials and forthright detailing.", "effect came from the landscape", "审美效果来自景观、新材料和直接明晰的细节设计。", "推理题", "把新材料等同于环保材料，或无依据推出机械设备普及。", "B 对应 landscape。", "列举句优先选有原词或直接同义替换的一项。"),
    },
  },
  "2011-english2-text4": {
    articleStructure: "P1-P2 提出欧盟的长期与急性危机；P3 说明法德分歧；P4-P5 对比德国和法国方案；P6 给出谨慎乐观结论。",
    structureMap: [{ paragraph: "P1-P2", role: "问题", summary: "债务、人口和增长问题削弱欧元区信心。" }, { paragraph: "P3-P5", role: "分歧", summary: "法德对协调与救助路径存在分歧。" }, { paragraph: "P6", role: "结论", summary: "作者肯定欧盟的开放市场价值。" }],
    questions: {
      "2011-english2-text4-q36": analysis("Now even the project's greatest cheerleaders talk of a continent facing a Bermuda triangle of debt, population decline and lower growth.", "even cheerleaders talk of problems", "连最支持该项目的人也谈论欧洲面临的三重困境。", "推理题", "把 Markets lost faith 的主语偷换成 EU。", "B 表明支持者也开始担忧。", "代词题先核对 it 的指代主体。"),
      "2011-english2-text4-q37": analysis("France and Germany agree on the need for greater harmonization, but disagree about what to harmonise.", "agree on need but disagree on what", "法德同意需要协调，却对协调什么存在分歧。", "细节题：转折", "只看 agree，忽略 but 后的核心分歧。", "C 概括未能就协调达成一致。", "but 后常是考点，前后信息不能只取一半。"),
      "2011-english2-text4-q38": analysis("Germany thinks the euro must be saved by stricter rules on borrowing, spending and competitiveness.", "euro saved by stricter rules", "德国认为应以更严格的借贷、开支和竞争规则拯救欧元。", "细节题", "把冻结基金等制裁手段误作增加援助。", "B 是 stricter rules 的同义改写。", "政策题区分规则收紧与资金增加。"),
      "2011-english2-text4-q39": analysis("A system of redistribution from richer to poorer members, via cheaper borrowing for governments.", "redistribution from richer to poorer", "通过低息借贷等方式从富国向穷国再分配。", "推理题", "把共同债券控制权或严格政策当作原文结论。", "A 符合穷国更可能得到资金支持。", "经济题抓资金流向：from richer to poorer。"),
      "2011-english2-text4-q40": analysis("It is too soon to write off the EU. It remains the world's largest trading bloc.", "too soon to write off; remains largest bloc", "现在断言欧盟失败还为时过早；它仍是最大的贸易集团。", "态度题", "只看前文危机，忽略结尾正面评价。", "D 符合谨慎但明确的乐观态度。", "态度题以结尾评价句为最高权重。"),
    },
  },
};
