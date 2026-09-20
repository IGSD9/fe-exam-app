"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "ホーム", icon: HomeIcon },
  { href: "/practice", label: "演習", icon: BookIcon },
  { href: "/review", label: "弱点", icon: ReviewIcon },
  { href: "/settings", label: "設定", icon: SettingsIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const hidden = pathname === "/privacy" || pathname === "/contact";
  if (hidden) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur">
      <ul className="mx-auto grid max-w-lg grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs ${
                  active ? "text-blue-700" : "text-slate-400"
                }`}
              >
                <Icon active={active} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8.5Z"
        stroke={active ? "#1d4ed8" : "#94a3b8"}
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BookIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21.5V5.5Z"
        stroke={active ? "#1d4ed8" : "#94a3b8"}
        strokeWidth="1.8"
      />
      <path d="M5 21.5A2.5 2.5 0 0 1 7.5 19H20" stroke={active ? "#1d4ed8" : "#94a3b8"} strokeWidth="1.8" />
    </svg>
  );
}

function ReviewIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke={active ? "#1d4ed8" : "#94a3b8"} strokeWidth="1.8" />
      <path d="M12 8v5l3 2" stroke={active ? "#1d4ed8" : "#94a3b8"} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke={active ? "#1d4ed8" : "#94a3b8"} strokeWidth="1.8" />
      <path
        d="M12 4.5v2M12 17.5v2M4.5 12h2M17.5 12h2M6.4 6.4l1.4 1.4M16.2 16.2l1.4 1.4M17.6 6.4l-1.4 1.4M7.8 16.2 6.4 17.6"
        stroke={active ? "#1d4ed8" : "#94a3b8"}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
