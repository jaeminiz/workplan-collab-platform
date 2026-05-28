import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-950">문서/파일</h1>
        <p className="mt-1 text-sm text-slate-500">
          문서관리, 웹디스크, 업무 첨부를 Supabase Storage 기반 파일 시스템으로 통합합니다.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>파일 보관 구조</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
          {["프로젝트 파일", "업무 첨부", "공용 문서"].map((item) => (
            <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-4 font-semibold">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
