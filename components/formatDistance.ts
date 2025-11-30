import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export function formatNotificationDate(date: Date) {
  return formatDistanceToNow(date, {
    locale: ar,
    addSuffix: true,
  });
}
