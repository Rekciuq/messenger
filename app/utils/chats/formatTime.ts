import { DateTime } from "luxon";

export const formatTime = (timestamp: string) => {
  const date = DateTime.fromISO(timestamp);
  const now = DateTime.now();
  const diff = now.diff(date, ['days', 'hours', 'minutes']);

  const minutes = Math.floor(diff.minutes);
  const hours = Math.floor(diff.hours);
  const days = Math.floor(diff.days);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  return date.toLocaleString(DateTime.DATE_MED).toLocaleLowerCase();
};