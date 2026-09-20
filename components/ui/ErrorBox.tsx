type ErrorBoxProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorBox({ message, onRetry }: ErrorBoxProps) {
  return (
    <div className="mt-5 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="mt-2 font-bold underline">
          再試行
        </button>
      ) : null}
    </div>
  );
}
