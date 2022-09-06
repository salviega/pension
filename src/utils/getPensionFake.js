
export const getPensionFake = (values) => {
  const labels = [];
  for (let index = 1; index <= 100; index++) {
    labels.push(index);
  }

  const numRandon = Math.round(Math.random() * 10)
  
  const data = labels.map((item) => item *numRandon );

  return { labels, data };
};
