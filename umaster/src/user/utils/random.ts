/**
 * randomSixDigitNum
 * @returns {number}
 */
export const randomSixDigitNum = () => {
  const rndNum = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  return rndNum;
};
