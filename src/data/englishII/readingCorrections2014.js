const text1Passage = `What would you do with $590m? This is now a question for Gloria Mackenzie, an 84-year-old widow who recently emerged from her small, tin-roofed house in Florida to collect the biggest undivided lottery jackpot in history. If she hopes her newfound fortune will yield lasting feelings of fulfillment, she could do worse than read Happy Money by Elizabeth Dunn and Michael Norton.

These two academics use an array of behavioral research to show that the most rewarding ways to spend money can be counterintuitive. Fantasies of great wealth often involve visions of fancy cars and extravagant homes. Yet satisfaction with these material purchases wears off fairly quickly: what was once exciting and new becomes old hat; regret creeps in. It is far better to spend money on experiences, say Ms. Dunn and Mr. Norton, like interesting trips, unique meals or even going to the cinema. These purchases often become more valuable with time as stories or memories, particularly if they involve feeling more connected to others.

This slim volume is packed with tips to help wage slaves as well as lottery winners get the most "happiness bang for your buck." It seems most people would be better off if they could shorten their commutes to work, spend more time with friends and family and less of it watching television, something the average American spends a whopping two months a year doing, and is hardly jollier for it. Buying gifts or giving to charity is often more pleasurable than purchasing things for oneself, and luxuries are most enjoyable when they are consumed sparingly. This is apparently the reason McDonald's restricts the availability of its popular McRib, a marketing trick that has turned the pork sandwich into an object of obsession.

Readers of Happy Money are clearly a privileged lot, anxious about fulfillment, not hunger. Money may not quite buy happiness, but people in wealthier countries are generally happier than those in poor ones. Yet the link between feeling good and spending money on others can be seen among rich and poor people around the world, and scarcity enhances the pleasure of most things for most people. Not everyone will agree with the authors' policy ideas, which range from mandating more holiday time to reducing tax incentives for American homebuyers. But most people will come away from this book believing it was money well spent.`;

export function applyEnglishIIReadingCorrections2014(reading) {
  if (reading?.id !== "2014-english2-text1") return reading;

  return {
    ...reading,
    title: "Happy Money: Smart Ways to Spend",
    passage: text1Passage,
    questions: reading.questions.map((question) => (
      question.id === "2014-english2-text1-q25" ? { ...question, answer: "A" } : question
    )),
  };
}
