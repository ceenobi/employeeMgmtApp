import dayjs from "dayjs";

export const generateRandomUniqueId = () => {
  let result = "E";
  const uniqueDigits = new Set();

  while (uniqueDigits.size < 6) {
    uniqueDigits.add(Math.floor(Math.random() * 10));
  }

  uniqueDigits.forEach((digit) => {
    result += digit;
  });

  return result;
};

export const generatePayrollId = () => {
  let result = "P";
  const uniqueDigits = new Set();

  while (uniqueDigits.size < 6) {
    uniqueDigits.add(Math.floor(Math.random() * 10));
  }

  uniqueDigits.forEach((digit) => {
    result += digit;
  });

  return result;
};

const month = dayjs().month();
export const getMonthValue = () => {
  switch (month) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      return "Invalid month";
  }
};