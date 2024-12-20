import dayjs from "dayjs";

export const formatDate = (item: string) => {
  const getDate = dayjs(item).format("DD/MM/YYYY");
  return getDate;
};

export const formatFullDate = (date: string) => {
  if (date) {
    const formattedDate = new Date(date);
    if (!isNaN(formattedDate.getTime())) {
      return formattedDate.toISOString().split("T")[0];
    }
  }
  return null;
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
