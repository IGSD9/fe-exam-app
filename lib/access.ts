export function getLatestYear(years: string[]): string | null {
  if (years.length === 0) return null;
  return [...years].sort()[years.length - 1] ?? null;
}

export function canAccessYear(
  isPro: boolean,
  year: string,
  latestYear: string | null,
): boolean {
  if (isPro) return true;
  if (!latestYear) return false;
  return year === latestYear;
}

export function formatYear(year: string) {
  const match = year.match(/^(\d{4})-H([12])$/);
  if (!match) return year;
  return `${match[1]}年${match[2] === "1" ? "春" : "秋"}`;
}
