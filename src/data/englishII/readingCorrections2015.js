const text1Passage = `A new study suggests that contrary to most surveys, people are actually more stressed at home than at work. Researchers measured people's cortisol, which is a stress marker, while they were at work and while they were at home and found it higher at what is supposed to be a place of refuge. "Further contradicting conventional wisdom, we found that women as well as men have lower levels of stress at work than at home," writes one of the researchers, Sarah Damaske. In fact women even say they feel better at work, she notes. "It is men, not women, who report being happier at home than at work." Another surprise is that the findings hold true for both those with children and without, but more so for nonparents.

This is why people who work outside the home have better health. What the study doesn't measure is whether people are still doing work when they're at home, whether it is household work or work brought home from the office. For many men, the end of the workday is a time to kick back. For women who stay home, they never get to leave the office. And for women who work outside the home, they often are playing catch-up with household tasks. With the blurring of roles, and the fact that the home front lags well behind the workplace in making adjustments for working women, it's not surprising that women are more stressed at home.

But it's not just a gender thing. At work, people pretty much know what they're supposed to be doing: working, making money, doing the tasks they have to do in order to draw an income. The bargain is very pure: employee puts in hours of physical or mental labor and employee draws out life-sustaining moola.

On the home front, however, people have no such clarity. Rare is the household in which the division of labor is so clinically and methodically laid out. There are a lot of tasks to be done, and there are inadequate rewards for most of them. Your home colleagues, your family, have no clear rewards for their labor; they need to be talked into it, or if they're teenagers, threatened with complete removal of all electronic devices. Plus, they're your family. You cannot fire your family. You never really get to go home from home.

So it's not surprising that people are more stressed at home. Not only are the tasks apparently infinite, the co-workers are much harder to motivate.`;

const text2Passage = `For years, studies have found that first-generation college students, those who do not have a parent with a college degree, lag other students on a range of educational achievement factors. Their grades are lower and their dropout rates are higher. But since such students are most likely to advance economically if they succeed in higher education, colleges and universities have pushed for decades to recruit more of them. This has created "a paradox" in that recruiting first-generation students, but then watching many of them fail, means that higher education has "continued to reproduce and widen, rather than close" an achievement gap based on social class, according to the depressing beginning of a paper forthcoming in the journal Psychological Science.

But the article is actually quite optimistic, as it outlines a potential solution to this problem, suggesting that an approach involving a one-hour, next-to-no-cost program can close 63 percent of the achievement gap, measured by such factors as grades, between first-generation and other students. The authors of the paper are from different universities, and their findings are based on a study involving 147 students who completed the project at an unnamed private university.

First generation was defined as not having a parent with a four-year college degree. Most of the first-generation students, 59.1 percent, were recipients of Pell Grants, a federal grant for undergraduates with financial need, while this was true only for 8.6 percent of the students with at least one parent with a four-year degree.

Their thesis, that a relatively modest intervention could have a big impact, was based on the view that first-generation students may be most lacking not in potential but in practical knowledge about how to deal with the issues that face most college students. They cite past research by several authors to show that this is the gap that must be narrowed to close the achievement gap.

Many first-generation students "struggle to navigate the middle-class culture of higher education, learn the rules of the game, and take advantage of college resources," they write. And this becomes more of a problem when colleges don't talk about the class advantages and disadvantages of different groups of students. Because US colleges and universities seldom acknowledge how social class can affect students' educational experiences, many first-generation students lack insight about why they are struggling and do not understand how students like them can improve.`;

export function applyEnglishIIReadingCorrections2015(reading) {
  if (reading?.id === "2015-english2-text2") {
    return {
      ...reading,
      title: "Closing the First-Generation Achievement Gap",
      passage: text2Passage,
      questions: reading.questions.map((question) => ({
        ...question,
        answer: ({
          "2015-english2-text2-q26": "D",
          "2015-english2-text2-q27": "C",
          "2015-english2-text2-q28": "C",
          "2015-english2-text2-q29": "D",
          "2015-english2-text2-q30": "B",
        })[question.id] ?? question.answer,
      })),
    };
  }

  if (reading?.id === "2015-english2-text1") {
    return { ...reading, title: "Why Home Can Be More Stressful Than Work", passage: text1Passage };
  }

  return reading;
}
