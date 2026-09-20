"use client";

type PurchaseButtonProps = {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  label?: string;
};

export function PurchaseButton({
  loading,
  disabled,
  onClick,
  label = "全問題を解放する",
}: PurchaseButtonProps) {
  return (
    <button
      type="button"
      disabled={loading || disabled}
      onClick={onClick}
      className="w-full rounded-2xl bg-blue-700 px-4 py-3.5 text-sm font-bold text-white disabled:opacity-60"
    >
      {loading ? "処理中..." : label}
    </button>
  );
}
