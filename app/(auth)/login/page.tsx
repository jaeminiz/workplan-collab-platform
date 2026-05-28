import { Chrome, KeyRound, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllowedWorkspaceDomain, googleOAuthScopes } from "@/lib/auth/google";
import { hasSupabaseEnv } from "@/lib/supabase/client";

export default function LoginPage() {
  const domain = getAllowedWorkspaceDomain();
  const isSupabaseConfigured = hasSupabaseEnv();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f5] px-4 py-10">
      <Card className="w-full max-w-md border-stone-200">
        <CardHeader>
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-stone-900 text-white">
            <KeyRound className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl">Google Workspace 로그인</CardTitle>
          <p className="text-sm leading-6 text-stone-600">
            MiniPark Work OS는 Google OAuth를 기본 인증으로 사용합니다. Supabase 환경변수를
            연결하면 실제 로그인 플로우를 활성화할 수 있습니다.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSupabaseConfigured ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`가
              아직 설정되지 않았습니다.
            </div>
          ) : null}
          <Button className="w-full" disabled={!isSupabaseConfigured}>
            <Chrome className="mr-2 h-4 w-4" />
            Google 계정으로 계속
          </Button>
          <div className="rounded-md border border-stone-200 bg-white p-3 text-xs leading-5 text-stone-600">
            <div className="mb-1 flex items-center gap-2 font-medium text-stone-900">
              <ShieldCheck className="h-4 w-4" />
              인증 정책
            </div>
            허용 도메인: {domain || "미설정"} · Scope: {googleOAuthScopes.length}개
          </div>
          <Link href="/dashboard" className="block text-center text-sm font-medium text-stone-700">
            대시보드로 돌아가기
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
