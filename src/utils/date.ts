import { formatDistance } from "date-fns";
import { id } from "date-fns/locale";

export function timeAgo(date: number) {
  const timeAgoStr = formatDistance(date || 0, new Date(), {
    addSuffix: true,
    locale: id,
  });

  return timeAgoStr;
}

export function timestampToUI(timestamp: string) {
  const date = new Date(timestamp);

  const formatter = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedDate = formatter.format(date);
  return formattedDate;
}
