import faker from 'faker';

export const getPensionFake = (values) => {
  const labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const data = labels.map(() => faker.datatype.number({ min: 0, max: 20 }));
  return { labels, data };
};
