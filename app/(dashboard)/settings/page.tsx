import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllowedWorkspaceDomain, googleOAuthScopes } from "@/lib/auth/google";
import { hasSupabaseEnv } from "@/lib/supabase/client";

export default function SettingsPage() {
  const isSupabaseConfigured = hasSupabaseEnv();
  const workspaceDomain = getAllowedWorkspaceDomain();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "미설정";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-stone-950">설정</h1>
        <p className="mt-2 text-sm text-stone-500">
          Google OAuth, Slack/Telegram/Kakao, Gmail/Gemini, ERP, API/MCP 연동을 단계적으로 연결합니다.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>환경 연결 상태</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-stone-600">
          <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
            Supabase: {isSupabaseConfigured ? "환경변수 설정됨" : "환경변수 미설정"}
          </div>
          <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
            앱 URL: {appUrl}
          </div>
          <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
            Google Workspace 도메인: {workspaceDomain ?? "미설정"} · OAuth scope {googleOAuthScopes.length}개
          </div>
          <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
            운영 DB 적용 필요 migration: 0002, 0003, 0004
          </div>
          <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
            외부 연동: 초기 PR에서는 DB/API 구조와 문서만 준비
          </div>
          <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
            ERP 연동: 고객, 프로젝트, 구매, 재고, 출고, 계산서 동기화 API 계약 준비
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
