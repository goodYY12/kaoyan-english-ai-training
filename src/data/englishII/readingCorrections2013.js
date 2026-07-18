const text2Passage = `A century ago, the immigrants from across the Atlantic included settlers and sojourners. Along with the many folks looking to make a permanent home in the United States came those who had no intention to stay, and who would make some money and then go home. Between 1908 and 1915, about 7 million people arrived while about 2 million departed. About a quarter of all Italian immigrants, for example, eventually returned to Italy for good. They even had an affectionate nickname, "uccelli di passaggio," birds of passage.

Today, we are much more rigid about immigrants. We divide newcomers into two categories: legal or illegal, good or bad. We hail them as Americans in the making, or brand them as aliens fit for deportation. That framework has contributed mightily to our broken immigration system and the long political paralysis over how to fix it. We don't need more categories, but we need to change the way we think about categories. We need to look beyond strict definitions of legal and illegal. To start, we can recognize the new birds of passage, those living and thriving in the gray areas. We might then begin to solve our immigration challenges.

Crop pickers, violinists, construction workers, entrepreneurs, engineers, home health-care aides and particle physicists are among today's birds of passage. They are energetic participants in a global economy driven by the flow of work, money and ideas. They prefer to come and go as opportunity calls them. They can manage to have a job in one place and a family in another.

With or without permission, they straddle laws, jurisdictions and identities with ease. We need them to imagine the United States as a place where they can be productive for a while without committing themselves to staying forever. We need them to feel that home can be both here and there and that they can belong to two nations honorably.

Accommodating this new world of people in motion will require new attitudes on both sides of the immigration battle. Looking beyond the culture-war logic of right or wrong means opening up the middle ground and understanding that managing immigration today requires multiple paths and multiple outcomes, including some that are not easy to accomplish legally in the existing system.`;

export function applyEnglishIIReadingCorrections2013(reading) {
  if (reading?.id !== "2013-english2-text2") return reading;
  return { ...reading, passage: text2Passage };
}
