const LABELS = ["ア", "イ", "ウ", "エ"] as const;

type ExplanationPanelProps = {
  explanation: string | null;
  correctIndex: number;
};

export function ExplanationPanel({ explanation, correctIndex }: ExplanationPanelProps) {
  return (
    <section className="rounded-3xl bg-slate-900 p-5 text-white">
      <p className="text-xs tracking-wide text-slate-300">解説</p>
      <p className="mt-2 text-sm font-bold text-amber-300">正解は {LABELS[correctIndex]}</p>
      <p className="mt-3 leading-7 text-slate-100">{explanation ?? "解説は準備中です。"}</p>
    </section>
  );
}
