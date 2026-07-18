const text1Passage = `A new study suggests that contrary to most surveys, people are actually more stressed at home than at work. Researchers measured people's cortisol, which is a stress marker, while they were at work and while they were at home and found it higher at what is supposed to be a place of refuge. "Further contradicting conventional wisdom, we found that women as well as men have lower levels of stress at work than at home," writes one of the researchers, Sarah Damaske. In fact women even say they feel better at work, she notes. "It is men, not women, who report being happier at home than at work." Another surprise is that the findings hold true for both those with children and without, but more so for nonparents.

This is why people who work outside the home have better health. What the study doesn't measure is whether people are still doing work when they're at home, whether it is household work or work brought home from the office. For many men, the end of the workday is a time to kick back. For women who stay home, they never get to leave the office. And for women who work outside the home, they often are playing catch-up with household tasks. With the blurring of roles, and the fact that the home front lags well behind the workplace in making adjustments for working women, it's not surprising that women are more stressed at home.

But it's not just a gender thing. At work, people pretty much know what they're supposed to be doing: working, making money, doing the tasks they have to do in order to draw an income. The bargain is very pure: employee puts in hours of physical or mental labor and employee draws out life-sustaining moola.

On the home front, however, people have no such clarity. Rare is the household in which the division of labor is so clinically and methodically laid out. There are a lot of tasks to be done, and there are inadequate rewards for most of them. Your home colleagues, your family, have no clear rewards for their labor; they need to be talked into it, or if they're teenagers, threatened with complete removal of all electronic devices. Plus, they're your family. You cannot fire your family. You never really get to go home from home.

So it's not surprising that people are more stressed at home. Not only are the tasks apparently infinite, the co-workers are much harder to motivate.`;

export function applyEnglishIIReadingCorrections2015(reading) {
  if (reading?.id !== "2015-english2-text1") return reading;
  return { ...reading, title: "Why Home Can Be More Stressful Than Work", passage: text1Passage };
}
