export const validateRegisterForm = (values) => {
  const validator = { birthDate: false, gender: false, check: false };
  const minAge = 568024200000;

  if (values.birthDate) validator.birthDate = new Date() - new Date(values.birthDate) > minAge;
  if (values.gender) validator.gender = true;
  if (values.check) validator.check = true;

  return validator;
};

export const verifyform = (values) => {
  const valid = Object.values(values);

  for (const item of valid) if (!item) return false;
  return true;
};
