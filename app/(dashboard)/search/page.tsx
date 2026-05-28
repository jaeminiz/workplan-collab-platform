import { SearchPanel } from "@/components/search/search-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-stone-950">통합검색</h1>
        <p className="mt-2 text-sm text-stone-500">
          제목 검색 한계를 개선하기 위해 본문, 댓글, 메일, 첨부 메타데이터까지 검색 대상으로 설계합니다.
        </p>
      </div>
      <SearchPanel />
      <Card>
        <CardHeader>
          <CardTitle>검색 확장 계획</CardTitle>
        </CardHeader>
        <CardContent className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
          현재는 프로젝트, 업무, 쪽지 mock API를 검색합니다. Supabase 연결 후 본문, 댓글, 파일명, 고객,
          호선, ERP 동기화 데이터까지 검색 범위를 확장합니다.
        </CardContent>
      </Card>
    </div>
  );
}
