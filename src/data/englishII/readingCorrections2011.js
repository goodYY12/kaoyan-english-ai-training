function applyReplacements(text, replacements) {
  return replacements.reduce((current, [from, to]) => current.replaceAll(from, to), String(text ?? ""));
}

export function applyEnglishIIReadingCorrections(reading) {
  const correction = readingCorrections2011[reading.id];
  if (!correction) return reading;

  return {
    ...reading,
    passage: applyReplacements(reading.passage, correction.passageReplacements),
    questions: (reading.questions ?? []).map((question) => ({
      ...question,
      ...(correction.questions[question.id] ?? {}),
    })),
  };
}

export const readingCorrections2011 = {
  "2011-english2-text1": {
    passageReplacements: [
      ["January 2000 a year later", "January 2000; a year later"],
      ["attracting much eroticism", "attracting much criticism"],
      ["compensation commite", "compensation committee"],
      ["cnormous", "enormous"], ["uremarked", "unremarked"], ["had lef the board", "had left the board"],
      ["The position wa just aking up too much tim,she said.", "The position was just taking up too much time, she said."],
      ["If the sky, and the share price is fallin, utside directors", "If the sky, and the share price, is falling, outside directors"],
      ["database hat covered more than 10,000 frms and more than 64,00 ffen dirctor ewen 189 and 2004.", "database that covered more than 10,000 firms and more than 64,000 different directors between 1989 and 2004."],
      ["stayed fom one proxy statement", "stayed from one proxy statement"],
      ["disappearancs by diretor une he age of 70", "disappearances by directors under the age of 70"],
      ["They fount that after as urpris departure,the probabiliy that the company will sbsequently have to restate earmings increased by nearly 20%.", "They found that after a surprise departure, the probability that the company will subsequently have to restate earnings increases by nearly 20%."],
      ["at the fim is suggestiv, i des not", "at the firm is suggestive, it does not"],
      ["Ofien they \"rade up.\" eaving riskier, smaller fims", "Often they \"trade up,\" leaving riskier, smaller firms"],
      ["ousde firctors trorat tugh times", "outside directors through tough times"],
      ["wrongdoing occured", "wrongdoing occurred"],
      ["Fims who", "Firms who"], ["University.For", "University. For"], ["committee, how", "committee; how"],
    ],
    questions: {
      "2011-english2-text1-q21": { questionText: "According to Paragraph 1, Ms. Simmons was criticized for ____.", options: { A: "gaining excessive profits", B: "failing to fulfill her duty", C: "refusing to make compromises", D: "leaving the board in tough times" } },
      "2011-english2-text1-q22": { questionText: "We learn from Paragraph 2 that outside directors are supposed to be ____.", options: { A: "generous investors", B: "unbiased executives", C: "share price forecasters", D: "independent advisers" } },
      "2011-english2-text1-q23": { questionText: "According to the researchers from Ohio University, after an outside director's surprise departure, the firm is likely to ____.", options: { A: "become more stable", B: "report increased earnings", C: "do less well in the stock market", D: "perform worse in lawsuits" } },
      "2011-english2-text1-q24": { questionText: "It can be inferred from the last paragraph that outside directors ____.", options: { A: "may stay for the attractive offers from the firm", B: "have often had records of wrongdoings in the firm", C: "are accustomed to stress-free work in the firm", D: "will decline incentives from the firm" } },
      "2011-english2-text1-q25": { questionText: "The author's attitude toward the role of outside directors is ____.", options: { A: "permissive", B: "positive", C: "scornful", D: "critical" } },
    },
  },
  "2011-english2-text2": {
    passageReplacements: [
      ["death of newspaper?", "death of newspapers?"], ["hratened", "threatened"], ["adverising", "advertising"],
      ["In much of the world there is the sign of crisis.", "In much of the world there is little sign of crisis."],
      ["roubled come", "troubled corner"], ["ofien", "often"], ["an, saly for may youmals, thy an e psha trtr.", "and, sadly for many journalists, they can be pushed further."],
      ["in thei reiane on ads", "in their reliance on ads"], ["Fuly870of thir revenves", "Fully 87% of their revenues"],
      ["In Japan the proportion is35%.", "In Japan the proportion is 35%."], ["where newspaper are least distinctive", "where newspapers are least distinctive"],
      ["geneal businessortrr rin ashave e eautf s wpaeesm result", "general business reporters. Foreign bureaus have been savagely cut off. Newspapers are less complete as a result"],
      ["crisis.German", "crisis. German"], ["global indusry", "global industry"], ["recession Even", "recession. Even"], ["everybody,but", "everybody, but"], ["gone.So", "gone. So"],
    ],
    questions: {
      "2011-english2-text2-q26": { questionText: "By saying \"Newspapers like ... their own doom\" (Lines 3-4, Para. 1), the author indicates that newspapers ____.", options: { A: "neglected the sign of crisis", B: "failed to get state subsidies", C: "were not charitable corporations", D: "were in a desperate situation" } },
      "2011-english2-text2-q27": { questionText: "Some newspapers refused delivery to distant suburbs probably because ____.", options: { A: "readers threatened to pay less", B: "newspapers wanted to reduce costs", C: "journalists reported little about these areas", D: "subscribers complained about slimmer products" } },
      "2011-english2-text2-q28": { questionText: "Compared with their American counterparts, Japanese newspapers are much more stable because they ____.", options: { A: "have more sources of revenue", B: "have more balanced newsrooms", C: "are less dependent on advertising", D: "are less affected by readership" } },
      "2011-english2-text2-q29": { questionText: "What can be inferred from the last paragraph about the current newspaper business?", options: { A: "Distinctiveness is an essential feature of newspapers.", B: "Completeness is to blame for the failure of newspapers.", C: "Foreign bureaus play a crucial role in the newspaper business.", D: "Readers have lost their interest in car and film reviews." } },
      "2011-english2-text2-q30": { questionText: "The most appropriate title for this text would be ____.", options: { A: "American Newspapers: Struggling for Survival", B: "American Newspapers: Gone with the Wind", C: "American Newspapers: A Thriving Business", D: "American Newspapers: A Hopeless Story" } },
    },
  },
  "2011-english2-text3": {
    passageReplacements: [
      ["World War Il", "World War II"], ["returming home by the milions, going of to olege on the G. I! Bill and ling p a the marriage bureaus.", "returning home by the millions, going off to college on the G. I. Bill and lining up at the marriage bureaus."],
      ["with the postar confidence in h trte mads maliingps", "with the postwar confidence in the future, made small, efficient housing positively stylish."],
      ["and that restraint, in combination wih the postar confidence in h trte mads maliingps", "and that restraint, in combination with the postwar confidence in the future, made small, efficient housing positively stylish."],
      ["Economic condition was only a stimulus for the trend toward efficien iving.The pras\" ess is more\"r was actually frs pularied by a German, the arehitet Ludiwig Mies van der Rohe, who like other people associated with the Bauhaus, a school of design, emigrated to the United States before World War Il and took up posts at American architecture schools. These designers came to exert enormous influence on the course of American architecture, but none more so that Mics.", "Economic conditions were only a stimulus for the trend toward efficient living. The phrase \"less is more\" was actually first popularized by a German, the architect Ludwig Mies van der Rohe, who, like other people associated with the Bauhaus, a school of design, emigrated to the United States before World War II and took up posts at American architecture schools. These designers came to exert enormous influence on the course of American architecture, but none more so than Mies."],
      ["less deoration, properly organized, has more impact that a lot", "less decoration, properly organized, has more impact than a lot"], ["moderm", "modern"], ["e employed", "he employed"], ["today buy that", "today but that"], ["symbolizecd", "symbolized"], ["Mis's", "Mies's"], ["spacs he designed were smal and effien", "spaces he designed were small and efficient"],
      ["were smaler-two-bedroom units under 1,000 qguare feetan those in their older neighbors along the city's Gold Coast. But they were popular because of their airy giss walsh iews hy rodrnd h egarce of tfe buding:s? details and proportions", "were smaller—two-bedroom units under 1,000 square feet—than those in their older neighbors along the city's Gold Coast. But they were popular because of their airy glass walls, the views they afforded and the elegance of the buildings' details and proportions"],
      ["cntirely", "entirely"], ["builing", "building"], ["commissione from talented modemn architects by Califoria Arts & Architctre magazine", "commissioned from talented modern architects by California Arts & Architecture magazine"], ["ess is more\"trnd", "less is more\" trend"],
      ["In his Case Study House, Ralph everyday life- few American families acqured helicopters, though most eventually got clothes dryers but his belief that self-sufficiency was both desirable and inevitable was widely shared.", "In his Case Study House, Ralph Rapson may have mispredicted just how the mechanical revolution would impact everyday life—few American families acquired helicopters, though most eventually got clothes dryers—but his belief that self-sufficiency was both desirable and inevitable was widely shared."],
      ["Economic condition", "Economic conditions"], ["efficien iving", "efficient living"], ["The pras\" ess is more\"r", "The phrase \"less is more\""], ["frs pularied", "first popularized"], ["arehitet Ludiwig", "architect Ludwig"], ["who like", "who, like"], ["more so that Mics", "more so than Mies"], ["metal,glass", "metal, glass"], ["the fitur", "the future"], ["efficient,rather", "efficient, rather"],
    ],
    questions: {
      "2011-english2-text3-q31": { questionText: "The postwar American housing style largely reflected the Americans' ____.", options: { A: "prosperity and growth", B: "efficiency and practicality", C: "restraint and confidence", D: "pride and faithfulness" } },
      "2011-english2-text3-q32": { questionText: "Which of the following can be inferred from Paragraph 3 about Bauhaus?", options: { A: "It was founded by Ludwig Mies van der Rohe.", B: "Its designing concept was affected by World War II.", C: "Most American architects used to be associated with it.", D: "It had a great influence upon American architecture." } },
      "2011-english2-text3-q33": { questionText: "Mies held that elegance of architectural design ____.", options: { A: "was related to large space", B: "was identified with emptiness", C: "was not reliant on abundant decoration", D: "was not associated with efficiency" } },
      "2011-english2-text3-q34": { questionText: "What is true about the apartments Mies built on Chicago's Lake Shore Drive?", options: { A: "They ignored details and proportions.", B: "They were built with materials popular at that time.", C: "They were more spacious than neighboring buildings.", D: "They shared some characteristics of abstract art." } },
      "2011-english2-text3-q35": { questionText: "What can we learn about the design of the \"Case Study House\"?", options: { A: "Mechanical devices were widely used.", B: "Natural scenes were taken into consideration.", C: "Details were sacrificed for the overall effect.", D: "Eco-friendly materials were employed." } },
    },
  },
  "2011-english2-text4": {
    passageReplacements: [
      ["greatest cheerleder's ak of onint facing a \"Bermuda triangl\" of debt,population decin and lower growth.", "greatest cheerleaders talk of a continent facing a \"Bermuda triangle\" of debt, population decline and lower growth."],
      ["EU faces an acute crisis", "EU faces an acute crisis"], ["los faith", "lost faith"], ["curreney", "currency"], ["harmonies", "harmonise"],
      ["stricter rues on borrow spending and competitiveness, ared", "stricter rules on borrowing, spending and competitiveness, backed"],
      ["It iniststh omic co-odination should involve all 7 members of the EU club, among whom there is a small majority fof fe maret ibeaism and conomie rigors; in the inen cor alo, Cermany fears,a small majority favour French interference.", "It insists that economic co-ordination should involve all 27 members of the EU club, among whom there is a small majority for free-market liberalism and economic rigour; in the inner core alone, Germany fears, a small majority favour French interference."],
      ["\"southerm\" camp headed by French", "\"southern\" camp headed by France"], ["polticians", "politicians"], ["curo-zone", "euro-zone"], ["the France government", "the French government"],
      ["It is too soon to wite of the Bu.", "It is too soon to write off the EU."], ["trading block", "trading bloc"], ["At is bes", "At its best"], ["bult rund ingle market", "built around a single market"], ["is intea boders", "its internal borders"], ["blunt the sharpest dges of globaization,and make capitalis benign.", "blunt the sharpest edges of globalization, and make capitalism benign."],
      ["within the curo zone", "within the euro zone"], ["do not obey.These", "do not obey. These"], ["include treats", "include threats"], ["Eu ftnds", "EU funds"], ["t iniststh omic co-odination should involve all 7 members of the EU club, among whom there is a small majority fof fe maret ibeaism and conomie rigors; in the inen cor alo, Cermany fears,a small majority favour French interference.", "It insists that economic co-ordination should involve all 27 members of the EU club, among whom there is a small majority for free-market liberalism and economic rigour; in the inner core alone, Germany fears, a small majority favour French interference."], ["uro-zone", "euro-zone"], ["t remains", "It remains"], ["best,the", "best, the"], ["European projec", "European project"], ["liberal built", "liberal: built"], ["countries,its", "countries, its"],
      ["eeuro-zone", "euro-zone"],
    ],
    questions: {
      "2011-english2-text4-q36": { questionText: "The EU is faced with so many problems that ____.", options: { A: "it has more or less lost faith in markets", B: "even its supporters begin to feel concerned", C: "some of its member countries plan to abandon the euro", D: "it intends to deny the possibility of devaluation" } },
      "2011-english2-text4-q37": { questionText: "The debate over the EU's single currency is stuck because the dominant powers ____.", options: { A: "are competing for the leading position", B: "are busy handling their own crises", C: "fail to reach an agreement on harmonization", D: "disagree on the steps towards disintegration" } },
      "2011-english2-text4-q38": { questionText: "To solve the euro problem, Germany proposed that ____.", options: { A: "EU funds for poor regions be increased", B: "stricter regulations be imposed", C: "only core members be involved in economic co-ordination", D: "voting rights of the EU members be guaranteed" } },
      "2011-english2-text4-q39": { questionText: "The French proposal of handling the crisis implies that ____.", options: { A: "poor countries are more likely to get funds", B: "strict monetary policy will be applied to poor countries", C: "loans will be readily available to rich countries", D: "rich countries will basically control Eurobonds" } },
      "2011-english2-text4-q40": { questionText: "Regarding the future of the EU, the author seems to feel ____.", options: { A: "pessimistic", B: "desperate", C: "conceited", D: "hopeful" } },
    },
  },
};
