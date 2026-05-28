import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-950">고객관리</h1>
        <p className="mt-1 text-sm text-slate-500">
          고객사, 담당자, 프로젝트, 메일 이력을 연결해 과거 이력을 빠르게 찾도록 설계합니다.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>초기 CRM 범위</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          {["고객사", "담당자", "호선/품목", "관련 업무/메일"].map((item) => (
            <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-4 font-semibold">
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
