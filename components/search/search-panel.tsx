import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function SearchPanel() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <label htmlFor="global-search" className="mb-2 block text-sm font-bold text-slate-800">
        프로젝트, 업무, 본문, 댓글, 메일, 첨부, 고객, 호선 통합 검색
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          id="global-search"
          placeholder="예: H8282 ODME 설검, PEGASUS CLAIM, POSSM 연차검사"
          className="pl-9"
        />
      </div>
      <p className="mt-3 text-sm text-slate-500">
        초기 구현은 PostgreSQL Full Text Search와 trigram 인덱스를 사용하고, 첨부 OCR이나 대용량 검색이
        필요할 때 OpenSearch를 추가합니다.
      </p>
    </div>
  );
}
