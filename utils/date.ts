import { format, formatDistanceToNow } from "date-fns";

export const longDate = (date: string | Date) => {
  if (date instanceof Date || typeof date === "string") {
    return format(date, "dd MMM yyyy - kk:mm");
  }
  return "-";
};

export const shortDate = (date: string | Date) => {
  if (date instanceof Date || typeof date === "string") {
    return format(date, "P");
  }
  return "-";
};

export const timeAgo = (date: string | Date) => {
  if (date instanceof Date || typeof date === "string") {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  return "-";
};
