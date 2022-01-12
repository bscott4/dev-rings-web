import type { Dayjs } from "dayjs";
import { dayjs } from "@lib/dayjs";
import type { RepoEvent } from "@lib/firebase/firestore";

export const checkTimezone = (tz: string) =>
  dayjs().utcOffset() !== dayjs().tz(tz).utcOffset();

export const getDayEvents = (
  events: RepoEvent[] | null,
  dateString: string
) => {
  if (!events) return null;
  const dateStringEvents = events.map((event) => [
    dayjs(event.createdAt.toDate()).format("YYYY-MM-DD"),
    event,
  ]);

  const dayEvents = dateStringEvents
    .filter((event) => event[0] === dateString)
    .map((event) => event[1]) as RepoEvent[];

  if (!dayEvents.length) return null;
  return dayEvents;
};

export const getMonthName = (monthInView: MonthYear) => {
  const [month] = monthInView;
  const months = dayjs.months();
  return months[month - 1];
};

export type MonthYear = [number, number];
export const getMonthYear = (date?: Dayjs): MonthYear => [
  // Note: dayjs(undefined) === dayjs()
  dayjs(date).month() + 1,
  dayjs(date).year(),
];