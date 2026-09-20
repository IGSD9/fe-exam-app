export const QUALIFICATIONS = {
  fe: {
    id: "fe",
    title: "基本情報技術者試験",
  },
} as const;

export function getQualificationTitle(id: string) {
  return QUALIFICATIONS[id as keyof typeof QUALIFICATIONS]?.title ?? id;
}
