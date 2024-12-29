import dayjs from "dayjs";
type DateFormat = {
  startDate: Date;
  endDate?: Date;
};

export const formatDate = (item: string | Date) => {
  const getDate = dayjs(item).format("DD/MM/YYYY");
  return getDate;
};
export const formatBirthDate = (item: string | Date) => {
  const getDate = dayjs(item).format("DD/MM");
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

export const renderDate = (item: DateFormat) => {
  const start = dayjs(item.startDate).format("MMM DD, YYYY");
  const end = item.endDate ? dayjs(item.endDate).format("MMM DD, YYYY") : "";
  if (end) {
    return `${start} - ${end}`;
  } else {
    return `${start}`;
  }
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

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;
};
