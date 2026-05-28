import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  FileText,
  Home,
  LayoutDashboard,
  PanelLeft,
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
    <div className="min-h-screen bg-white text-stone-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-stone-200 bg-[#f7f7f5] lg:block">
        <div className="flex h-14 items-center gap-2 border-b border-stone-200 px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-stone-900 text-white">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-4">MiniPark</p>
            <p className="text-xs text-stone-500">Work OS</p>
          </div>
        </div>
        <div className="border-b border-stone-200 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-stone-600 hover:bg-stone-200/70 hover:text-stone-950"
          >
            <Home className="h-4 w-4" />
            홈
          </Link>
        </div>
        <nav className="space-y-0.5 p-3">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-stone-400">
            Workspace
          </p>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-200/70 hover:text-stone-950"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-stone-200 bg-white/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-2">
            <PanelLeft className="h-4 w-4 text-stone-400 lg:hidden" />
            <div>
              <p className="text-sm font-semibold text-stone-900">Workplan 대체 플랫폼</p>
              <p className="hidden text-xs text-stone-500 sm:block">
                프로젝트, 업무, 검색, AI/ERP 연동을 정리합니다.
              </p>
            </div>
          </div>
          <Link
            href="/search"
            className="hidden min-w-64 items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm text-stone-500 hover:bg-stone-100 md:flex"
          >
            <Search className="h-4 w-4" />
            검색
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Google 로그인
          </Link>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
