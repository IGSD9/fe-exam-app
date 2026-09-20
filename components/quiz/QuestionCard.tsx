type QuestionCardProps = {
  yearLabel: string;
  category: string;
  questionNumber: number;
  questionText: string;
  imageUrl: string | null;
  progress?: { current: number; total: number };
};

export function QuestionCard({
  yearLabel,
  category,
  questionNumber,
  questionText,
  imageUrl,
  progress,
}: QuestionCardProps) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700">
          {yearLabel} / {category}
        </span>
        <span>問{questionNumber}{progress ? ` ・ ${progress.current} / ${progress.total}` : ""}</span>
      </div>
      <p className="text-[17px] leading-8 font-medium text-slate-900">{questionText}</p>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="問題図" className="mt-4 w-full rounded-2xl bg-slate-100" />
      ) : null}
    </section>
  );
}
