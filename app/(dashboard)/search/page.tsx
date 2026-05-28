import { SearchPanel } from "@/components/search/search-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-950">통합검색</h1>
        <p className="mt-1 text-sm text-slate-500">
          제목 검색 한계를 개선하기 위해 본문, 댓글, 메일, 첨부 메타데이터까지 검색 대상으로 설계합니다.
        </p>
      </div>
      <SearchPanel />
      <Card>
        <CardHeader>
          <CardTitle>검색 결과 빈 상태</CardTitle>
        </CardHeader>
        <CardContent className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          검색어를 입력하면 프로젝트, 업무, 댓글, 파일, 고객 결과를 유형별로 구분해 표시합니다.
        </CardContent>
      </Card>
    </div>
  );
}
