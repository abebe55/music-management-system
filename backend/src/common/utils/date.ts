export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function isExpired(date: Date): boolean {
  return new Date() > date;
}

export function formatDate(date: Date): string {
  return date.toISOString();
}
