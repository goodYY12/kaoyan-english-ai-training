const text2Passage = `A century ago, the immigrants from across the Atlantic included settlers and sojourners. Along with the many folks looking to make a permanent home in the United States came those who had no intention to stay, and who would make some money and then go home. Between 1908 and 1915, about 7 million people arrived while about 2 million departed. About a quarter of all Italian immigrants, for example, eventually returned to Italy for good. They even had an affectionate nickname, "uccelli di passaggio," birds of passage.

Today, we are much more rigid about immigrants. We divide newcomers into two categories: legal or illegal, good or bad. We hail them as Americans in the making, or brand them as aliens fit for deportation. That framework has contributed mightily to our broken immigration system and the long political paralysis over how to fix it. We don't need more categories, but we need to change the way we think about categories. We need to look beyond strict definitions of legal and illegal. To start, we can recognize the new birds of passage, those living and thriving in the gray areas. We might then begin to solve our immigration challenges.

Crop pickers, violinists, construction workers, entrepreneurs, engineers, home health-care aides and particle physicists are among today's birds of passage. They are energetic participants in a global economy driven by the flow of work, money and ideas. They prefer to come and go as opportunity calls them. They can manage to have a job in one place and a family in another.

With or without permission, they straddle laws, jurisdictions and identities with ease. We need them to imagine the United States as a place where they can be productive for a while without committing themselves to staying forever. We need them to feel that home can be both here and there and that they can belong to two nations honorably.

Accommodating this new world of people in motion will require new attitudes on both sides of the immigration battle. Looking beyond the culture-war logic of right or wrong means opening up the middle ground and understanding that managing immigration today requires multiple paths and multiple outcomes, including some that are not easy to accomplish legally in the existing system.`;

const text4Passage = `Europe is not a gender-equality heaven. In particular, the corporate workplace will never be completely family-friendly until women are part of senior management decisions, and Europe's top corporate-governance positions remain overwhelmingly male. Indeed, women hold only 14 percent of positions on European corporate boards.

The European Union is now considering legislation to compel corporate boards to maintain a certain proportion of women, up to 60 percent. This proposed mandate was born of frustration. Last year, European Commission Vice President Viviane Reding issued a call to voluntary action. Reding invited corporations to sign up for a gender-balance goal of 40 percent female board membership. But her appeal was considered a failure: only 24 companies took it up.

Do we need quotas to ensure that women can continue to climb the corporate ladder fairly as they balance work and family?

"Personally, I don't like quotas," Reding said recently. "But I like what the quotas do." Quotas get action: they "open the way to equality and they break through the glass ceiling," according to Reding, a result seen in France and other countries with legally binding provisions on placing women in top business positions.

I understand Reding's reluctance and her frustration. I don't like quotas either; they run counter to my belief in meritocracy, government by the capable. But, when one considers the obstacles to achieving the meritocratic ideal, it does look as if a fairer world must be temporarily ordered.

After all, four decades of evidence has now shown that corporations in Europe and the US are evading the meritocratic hiring and promotion of women to top positions, no matter how much "soft pressure" is put upon them. When women do break through to the summit of corporate power, as Sheryl Sandberg recently did at Facebook, they attract massive attention precisely because they remain the exception to the rule.

If appropriate public policies were in place to help all women, whether CEOs or their children's caregivers, and all families, Sandberg would be no more newsworthy than any other highly capable person living in a more just society.`;

export function applyEnglishIIReadingCorrections2013(reading) {
  if (reading?.id === "2013-english2-text2") {
    return { ...reading, passage: text2Passage };
  }

  if (reading?.id === "2013-english2-text4") {
    return { ...reading, passage: text4Passage };
  }

  return reading;
}
