"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  FileText,
  MessageSquare,
  Search,
  SquareKanban
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { SearchResult, SearchResultType } from "@/features/search/repository";

type SearchResponse = {
  data: SearchResult[];
  source: "supabase" | "mock";
};

const resultTypeMeta: Record<
  SearchResultType,
  { label: string; icon: LucideIcon; description: string }
> = {
  project: {
    label: "프로젝트",
    icon: BriefcaseBusiness,
    description: "프로젝트 상세로 이동"
  },
  task: {
    label: "업무",
    icon: SquareKanban,
    description: "업무 상세로 이동"
  },
  comment: {
    label: "댓글",
    icon: MessageSquare,
    description: "댓글이 포함된 업무로 이동"
  },
  file: {
    label: "파일",
    icon: FileText,
    description: "첨부된 업무 또는 문서함으로 이동"
  },
  customer: {
    label: "고객",
    icon: Building2,
    description: "고객관리로 이동"
  },
  inbox: {
    label: "알림",
    icon: Bell,
    description: "알림함으로 이동"
  }
};

async function fetchSearchResults(query: string) {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error("검색 요청에 실패했습니다.");
  }

  return (await response.json()) as SearchResponse;
}

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim();
  const canSearch = normalizedQuery.length >= 2;

  const searchQuery = useQuery({
    queryKey: ["workspace-search", normalizedQuery],
    queryFn: () => fetchSearchResults(normalizedQuery),
    enabled: canSearch
  });

  const results = useMemo(() => searchQuery.data?.data ?? [], [searchQuery.data]);
  const sourceLabel = searchQuery.data?.source === "supabase" ? "Supabase DB" : "POC mock";

  return (
    <div className="rounded-md border border-stone-200 bg-white">
      <div className="border-b border-stone-100 p-4">
        <label htmlFor="global-search" className="mb-2 block text-sm font-medium text-stone-800">
          프로젝트, 업무, 본문, 댓글, 메일, 첨부, 고객, 호선 통합 검색
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <Input
            id="global-search"
            placeholder="예: H8282 ODME 설검, PEGASUS CLAIM, POSSM 연차검사"
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <p className="mt-3 text-sm text-stone-500">
          초기 구현은 PostgreSQL Full Text Search와 trigram 인덱스를 사용하고, 첨부 OCR이나 대용량 검색이
          필요할 때 OpenSearch를 추가합니다.
        </p>
      </div>
      <div className="p-2">
        {!normalizedQuery ? (
          <div className="p-4 text-sm text-stone-500">검색어를 입력하면 결과가 여기에 표시됩니다.</div>
        ) : null}
        {normalizedQuery && !canSearch ? (
          <div className="p-4 text-sm text-stone-500">두 글자 이상 입력해 주세요.</div>
        ) : null}
        {searchQuery.isLoading ? <div className="p-4 text-sm text-stone-500">검색 중입니다.</div> : null}
        {searchQuery.isError ? (
          <div className="p-4 text-sm text-red-600">검색 중 오류가 발생했습니다.</div>
        ) : null}
        {canSearch && !searchQuery.isLoading && !searchQuery.isError && results.length === 0 ? (
          <div className="p-4 text-sm text-stone-500">검색 결과가 없습니다.</div>
        ) : null}
        {canSearch && !searchQuery.isLoading && !searchQuery.isError && results.length > 0 ? (
          <div className="flex items-center justify-between gap-3 px-3 py-2 text-xs text-stone-500">
            <span>{results.length}개 결과</span>
            <span>{sourceLabel}</span>
          </div>
        ) : null}
        {results.map((result) => (
          <SearchResultItem key={`${result.type}-${result.id}`} result={result} />
        ))}
      </div>
    </div>
  );
}

function SearchResultItem({ result }: { result: SearchResult }) {
  const meta = resultTypeMeta[result.type];
  const Icon = meta.icon;

  return (
    <Link
      href={result.url as Route}
      className="grid gap-3 rounded-md px-3 py-3 hover:bg-stone-50 md:grid-cols-[1fr_auto] md:items-center"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-600">
            <Icon className="h-4 w-4" />
          </span>
          <Badge variant="secondary">{meta.label}</Badge>
          <p className="truncate font-medium text-stone-900">{result.title}</p>
        </div>
        <p className="mt-1 truncate text-sm text-stone-500">{result.subtitle}</p>
      </div>
      <span className="text-xs font-medium text-stone-500">{meta.description}</span>
    </Link>
  );
}
