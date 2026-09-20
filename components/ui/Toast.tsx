type ToastProps = {
  message: string;
};

export function Toast({ message }: ToastProps) {
  return (
    <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>
  );
}
