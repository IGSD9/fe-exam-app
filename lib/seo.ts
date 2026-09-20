import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/config";
import { getLatestYear } from "@/lib/access";
import { listQuestions } from "@/lib/questions";

export function listPublicSamples(limit = 3) {
  const questions = listQuestions();
  const latestYear = getLatestYear(questions.map((item) => item.year));
  return questions
    .filter((item) => item.year === latestYear)
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      year: item.year,
      category: item.category,
      questionNumber: item.questionNumber,
      questionText: item.questionText,
      options: item.options,
    }));
}

export function listPublicCategories() {
  return [...new Set(listQuestions().map((item) => item.category))].sort((a, b) =>
    a.localeCompare(b, "ja"),
  );
}

export const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  inLanguage: "ja",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
  },
};
