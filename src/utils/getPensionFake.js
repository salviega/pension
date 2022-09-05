import faker from 'faker';

export const getPensionFake = (values) => {
  const labels = [];
  for (let index = 1; index <= 500; index++) {
    labels.push(index);
  }
  const data = labels.map(() => faker.datatype.number({ min: 0, max: 500 }));
  return { labels, data };
};
