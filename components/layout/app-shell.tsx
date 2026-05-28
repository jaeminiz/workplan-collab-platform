import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  SquareKanban,
  Users
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

const navigation: { href: Route; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/projects", label: "프로젝트", icon: BriefcaseBusiness },
  { href: "/tasks", label: "업무", icon: SquareKanban },
  { href: "/inbox", label: "쪽지/알림", icon: Bell },
  { href: "/search", label: "통합검색", icon: Search },
  { href: "/documents", label: "문서/파일", icon: FileText },
  { href: "/customers", label: "고객관리", icon: Building2 },
  { href: "/settings", label: "설정", icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-extrabold">MiniPark Work OS</p>
            <p className="text-xs text-slate-500">Search-first collaboration</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8">
          <div>
            <p className="text-sm font-bold text-slate-950">Workplan 대체 플랫폼</p>
            <p className="hidden text-xs text-slate-500 sm:block">
              프로젝트, 업무, 검색, AI 연동을 한 화면에서 관리합니다.
            </p>
          </div>
          <Link
            href="/login"
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Google 로그인
          </Link>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
