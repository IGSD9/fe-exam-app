const LABELS = ["ア", "イ", "ウ", "エ"] as const;

export type OptionState =
  | "idle"
  | "selected-correct"
  | "selected-wrong"
  | "reveal-correct"
  | "disabled";

type OptionButtonProps = {
  index: number;
  label: string;
  state: OptionState;
  onSelect: (index: number) => void;
};

export function OptionButton({ index, label, state, onSelect }: OptionButtonProps) {
  const styles: Record<OptionState, string> = {
    idle: "border-slate-200 bg-white hover:border-blue-300",
    disabled: "border-slate-200 bg-white text-slate-500",
    "selected-correct": "border-emerald-500 bg-emerald-50 text-emerald-900",
    "selected-wrong": "border-rose-400 bg-rose-50 text-rose-900",
    "reveal-correct": "border-emerald-400 bg-emerald-50 text-emerald-900",
  };

  return (
    <button
      type="button"
      disabled={state !== "idle"}
      onClick={() => onSelect(index)}
      className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${styles[state]}`}
    >
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold">
        {LABELS[index]}
      </span>
      <span className="flex-1 leading-7">{label}</span>
      {state === "selected-correct" || state === "reveal-correct" ? (
        <span className="text-xs font-bold text-emerald-700">正解</span>
      ) : null}
      {state === "selected-wrong" ? (
        <span className="text-xs font-bold text-rose-700">不正解</span>
      ) : null}
    </button>
  );
}
