import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasSupabaseEnv } from "@/lib/supabase/client";

export default function SettingsPage() {
  const isSupabaseConfigured = hasSupabaseEnv();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-950">설정</h1>
        <p className="mt-1 text-sm text-slate-500">
          Google OAuth, Slack/Telegram/Kakao, Gmail/Gemini, API/MCP 연동을 단계적으로 연결합니다.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>환경 연결 상태</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            Supabase: {isSupabaseConfigured ? "환경변수 설정됨" : "환경변수 미설정"}
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            외부 연동: 초기 PR에서는 DB/API 구조와 문서만 준비
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
