const convert = (obj, articleCount: number) => {
  return Object.keys(obj).map((key) => ({
    name: key,
    value: obj[key],
    percentage: Number((obj[key] / articleCount) * 100)
  }));
};

export default convert;
