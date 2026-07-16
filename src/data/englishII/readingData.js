const readingModules = import.meta.glob("./readings/{2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020}/text*.json", {
  eager: true,
  import: "default",
});

export default Object.values(readingModules).sort((left, right) => (
  Number(right.year) - Number(left.year)
  || Number(String(left.textNumber).match(/\d+/)?.[0]) - Number(String(right.textNumber).match(/\d+/)?.[0])
));
