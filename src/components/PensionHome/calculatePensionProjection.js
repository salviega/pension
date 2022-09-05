/**
 * @param {object} range
 * @param {number} range.min
 * @param {number} range.max
 * @returns {number} number between min and max param
 */
function getRandom({ max = 1, min = 0 }) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}
/**
 *
 * @param {number} floatNumber number to round
 * @param {number} decimals amount of decimal to return
 * @returns
 */
function roundWithDecimal(floatNumber, decimals = 2) {
  return Math.round(floatNumber * 10 ** decimals) / 10 ** decimals;
}

/**
 *
 * @param {object} userData
 * @param {number} userData.userAge
 * @param {number} userData.monthlySalary
 * @param {('female'|'male')} userData.userGender
 * @param {number|string} userData.birthdate
 * @param {number} [userData.percentageAnnualIncreace]
 * @param {number} [userData.percentageOfsalaryToCoute]
 * @param {object} [userData.returnsRangeInvestmentFund]
 * @param {object} [userData.returnsRangeSolidarityFund]
 */
export function calculatePensionProjection({
  userAge,
  monthlySalary,
  userGender,
  birthdate,
  percentageAnnualIncreace = 0,
  percentageOfsalaryToCoute = 15,
  returnsRangeInvestmentFund = { min: 3, max: 9 },
  returnsRangeSolidarityFund = { min: 1, max: 3 },
}) {
  // const lifeExpectancy = userGender === 'female' ? 80 : 85
  const retirementAge = 61;

  const birthdateInDate = new Date(birthdate);

  const monthOfBirthdate = birthdateInDate.getMonth() + 1;
  const dayOfBirthdate = birthdateInDate.getDay() + 1;
  const yearOfRetirement = birthdateInDate.getFullYear() + retirementAge;

  const dateOfRetirement = new Date(`${yearOfRetirement}/${monthOfBirthdate}/${dayOfBirthdate}`);
  const currentTime = new Date();

  const yearUntilRetirement = dateOfRetirement.getFullYear() - currentTime.getFullYear();
  const monthsApart = dateOfRetirement.getMonth() - currentTime.getMonth();

  const coutesUntilRetirement = yearUntilRetirement * 12 + monthsApart;

  const data = {};
  data.coutesTodo = [];

  let totalCoutes = 0;
  let couteValue = monthlySalary * (percentageOfsalaryToCoute / 100);
  let solidarityFundAmount = 0;
  let investmentFundAmount = 0;
  let solidarityReturns = 0;
  let investmentReturns = 0;

  for (let coute = 1; coute <= coutesUntilRetirement; coute++) {
    // console.log({ solidarityFundAmount, solidarityReturns });
    totalCoutes = coute;
    investmentFundAmount += roundWithDecimal(couteValue * 0.23333333333333333 + investmentReturns * 0.9, 5);
    solidarityFundAmount += roundWithDecimal(couteValue * 0.76666666666666667 + solidarityReturns, 5);
    // console.log({ solidarityFundAmount, solidarityReturns });

    const investmentFundInterest = getRandom(returnsRangeInvestmentFund);
    const solidarityFundInterest = getRandom(returnsRangeSolidarityFund);

    data.coutesTodo.push({
      couteNumber: coute,
      couteValue,
      accumulatedInvestmentFund: investmentFundAmount,
      accumulatedSolidaryFund: solidarityFundAmount,
      investmentFundInterest,
      solidarityFundInterest,
      investmentReturnsGeneratedLastMonth: investmentReturns * 0.9,
      solidarityReturnsGeneratedLastMonth: solidarityReturns * 0.9,
    });

    solidarityReturns = roundWithDecimal(solidarityFundAmount * (solidarityFundInterest / 100 / 12), 5);
    investmentReturns = roundWithDecimal(investmentFundAmount * (investmentFundInterest / 100 / 12), 5);

    if (coute % 12 === 0) couteValue += Math.round(couteValue * (percentageAnnualIncreace / 100));
  }

  data.totalCoutes = totalCoutes;
  data.investmentFundAmount = investmentFundAmount;
  data.solidarityFundAmount = solidarityFundAmount;
  data.totalFundAmount = solidarityFundAmount + investmentFundAmount;

  return data;
}
