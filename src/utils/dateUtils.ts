import { format, isToday as isTodayFn, isTomorrow, isYesterday, parseISO, differenceInDays } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';

const locales = { tr, en: enUS };

export function getLocale(lang: string) {
  return locales[lang as keyof typeof locales] || tr;
}

export function formatDate(date: string, lang: string = 'tr'): string {
  return format(parseISO(date), 'd MMMM yyyy', { locale: getLocale(lang) });
}

export function formatShortDate(date: string, lang: string = 'tr'): string {
  return format(parseISO(date), 'd MMM', { locale: getLocale(lang) });
}

export function formatTime(time: string): string {
  return time.substring(0, 5);
}

export function formatDateTime(date: string, lang: string = 'tr'): string {
  return format(parseISO(date), 'd MMMM yyyy HH:mm', { locale: getLocale(lang) });
}

export function getRelativeDate(date: string, lang: string = 'tr'): string {
  const parsed = parseISO(date);
  if (isTodayFn(parsed)) return lang === 'tr' ? 'Bugün' : 'Today';
  if (isTomorrow(parsed)) return lang === 'tr' ? 'Yarın' : 'Tomorrow';
  if (isYesterday(parsed)) return lang === 'tr' ? 'Dün' : 'Yesterday';
  const days = differenceInDays(parsed, new Date());
  if (days > 0 && days <= 7) return lang === 'tr' ? `${days} gün sonra` : `in ${days} days`;
  return formatDate(date, lang);
}

export function isToday(date: string): boolean {
  return isTodayFn(parseISO(date));
}

export function isFuture(date: string): boolean {
  return parseISO(date) > new Date();
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function toISOTime(date: Date): string {
  return format(date, 'HH:mm');
}

export function getMonthRange(year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
  return { start, end };
}

export function getWeekRange(date: Date) {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(date);
  start.setDate(diff);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: toISODate(start), end: toISODate(end) };
}

export function calculateDuration(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}
