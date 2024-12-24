import dayjs from "dayjs";

export const formatDate = (item: string | Date) => {
  const getDate = dayjs(item).format("DD/MM/YYYY");
  return getDate;
};

export const formatFullDate = (date: string | Date) => {
  if (date) {
    const formattedDate = new Date(date);
    if (!isNaN(formattedDate.getTime())) {
      return formattedDate.toISOString().split("T")[0];
    }
  }
  return null;
};

export const calcLeaveDays = (leave: {
  startDate: string;
  endDate: string;
}) => {
  const startDateObj = dayjs(leave.startDate);
  const endDateObj = dayjs(leave.endDate);
  const differenceInDays = endDateObj.diff(startDateObj, "day") + 1;
  return differenceInDays;
};

export function formatCurrency(number: number) {
  const currency_format = new Intl.NumberFormat(undefined, {
    currency: "NGN",
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return currency_format.format(number);
}
