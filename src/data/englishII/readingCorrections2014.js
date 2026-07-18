const text1Passage = `What would you do with $590m? This is now a question for Gloria Mackenzie, an 84-year-old widow who recently emerged from her small, tin-roofed house in Florida to collect the biggest undivided lottery jackpot in history. If she hopes her newfound fortune will yield lasting feelings of fulfillment, she could do worse than read Happy Money by Elizabeth Dunn and Michael Norton.

These two academics use an array of behavioral research to show that the most rewarding ways to spend money can be counterintuitive. Fantasies of great wealth often involve visions of fancy cars and extravagant homes. Yet satisfaction with these material purchases wears off fairly quickly: what was once exciting and new becomes old hat; regret creeps in. It is far better to spend money on experiences, say Ms. Dunn and Mr. Norton, like interesting trips, unique meals or even going to the cinema. These purchases often become more valuable with time as stories or memories, particularly if they involve feeling more connected to others.

This slim volume is packed with tips to help wage slaves as well as lottery winners get the most "happiness bang for your buck." It seems most people would be better off if they could shorten their commutes to work, spend more time with friends and family and less of it watching television, something the average American spends a whopping two months a year doing, and is hardly jollier for it. Buying gifts or giving to charity is often more pleasurable than purchasing things for oneself, and luxuries are most enjoyable when they are consumed sparingly. This is apparently the reason McDonald's restricts the availability of its popular McRib, a marketing trick that has turned the pork sandwich into an object of obsession.

Readers of Happy Money are clearly a privileged lot, anxious about fulfillment, not hunger. Money may not quite buy happiness, but people in wealthier countries are generally happier than those in poor ones. Yet the link between feeling good and spending money on others can be seen among rich and poor people around the world, and scarcity enhances the pleasure of most things for most people. Not everyone will agree with the authors' policy ideas, which range from mandating more holiday time to reducing tax incentives for American homebuyers. But most people will come away from this book believing it was money well spent.`;

const text2Passage = `An article in Scientific American has pointed out that empirical research says that, actually, you think you're more beautiful than you are. We have a deep-seated need to feel good about ourselves and we naturally employ a number of self-enhancing strategies to achieve this. Social psychologists have amassed oceans of research into what they call the "above average effect" or "illusory superiority" and shown that, for example, 70% of us rate ourselves as above average in leadership, 93% in driving and 85% at getting on well with others, all obviously statistical impossibilities.

We rose-tint our memories and put ourselves into self-affirming situations. We become defensive when criticized, and apply negative stereotypes to others to boost our own esteem. We stalk around thinking we're hot stuff.

Psychologist and behavioral scientist Nicholas Epley oversaw a key study into self-enhancement and attractiveness. Rather than have people simply rate their beauty compared with others, he asked them to identify an original photograph of themselves from a lineup including versions that had been altered to appear more or less attractive. Visual recognition, reads the study, is "an automatic psychological process occurring rapidly and intuitively with little or no apparent conscious deliberation." If the subjects quickly chose a falsely flattering image, which most did, they genuinely believed it was really how they looked.

Epley found no significant gender difference in responses. Nor was there any evidence that those who self-enhance the most, that is, the participants who thought the most positively doctored pictures were real, were doing so to make up for profound insecurities. In fact, those who thought that the images higher up the attractiveness scale were real directly corresponded with those who showed other markers for having higher self-esteem. "I don't think the findings that we have are any evidence of personal delusion," says Epley. "It's a reflection simply of people generally thinking well of themselves." If you are depressed, you won't be self-enhancing.

Knowing the results of Epley's study, it makes sense that many people hate photographs of themselves so viscerally: on one level, they don't even recognise the person in the picture as themselves. Facebook, therefore, is a self-enhancer's paradise, where people can share only the most flattering photos, the cream of their wit, style, beauty, intellect and lifestyle. It's not that people's profiles are dishonest, says Catalina Toma of Wisconsin-Madison University, "but they portray an idealized version of themselves."`;

const text3Passage = `The concept of man versus machine is at least as old as the industrial revolution, but this phenomenon tends to be most acutely felt during economic downturns and fragile recoveries. And yet, it would be a mistake to think we are right now simply experiencing the painful side of a boom-and-bust cycle. Certain jobs have gone away for good, outmoded by machines. Since technology has such an insatiable appetite for eating up human jobs, this phenomenon will continue to restructure our economy in ways we can't immediately foresee.

When there is exponential improvement in the price and performance of technology, jobs that were once thought to be immune from automation suddenly become threatened. This argument has attracted a lot of attention, via the success of the book Race Against the Machine, by Erik Brynjolfsson and Andrew McAfee, who both hail from MIT's Center for Digital Business.

This is a powerful argument, and a scary one. And yet, John Hagel, author of The Power of Pull and other books, says Brynjolfsson and McAfee miss the reason why these jobs are so vulnerable to technology in the first place.

Hagel says we have designed jobs in the U.S. that tend to be "tightly scripted" and "highly standardized" ones that leave no room for "individual initiative or creativity." In short, these are the types of jobs that machines can perform much better at than human beings. That is how we have put a giant target sign on the backs of American workers, Hagel says.

It's time to reinvent the formula for how work is conducted, since we are still relying on a very 20th-century notion of work, Hagel says. In our rapidly changing economy, we more than ever need people in the workplace who can take initiative and exercise their imagination "to respond to unexpected events." That's not something machines are good at. They are designed to perform very predictable activities.

As Hagel notes, Brynjolfsson and McAfee indeed touched on this point in their book. We need to reframe race against the machine as race with the machine. In other words, we need to look at the ways in which machines can augment human labor rather than replace it. So then the problem is not really about technology, but rather, "how do we innovate our institutions and our work practices?"`;

export function applyEnglishIIReadingCorrections2014(reading) {
  if (reading?.id === "2014-english2-text2") {
    return { ...reading, title: "Why We See Ourselves as Better Than Average", passage: text2Passage };
  }

  if (reading?.id === "2014-english2-text3") {
    return { ...reading, title: "Race Against or With the Machine?", passage: text3Passage };
  }

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
