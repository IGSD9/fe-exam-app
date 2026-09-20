import type { ReactNode } from "react";

type PageHeaderProps = {
  kicker: string;
  title: string;
  action?: ReactNode;
};

export function PageHeader({ kicker, title, action }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="text-sm text-slate-500">{kicker}</p>
        <h1 className="mt-1 text-2xl font-bold">{title}</h1>
      </div>
      {action}
    </div>
  );
}
