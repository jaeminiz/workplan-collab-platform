import type { Metadata } from "next";

import { QueryProvider } from "@/components/layout/query-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Marsen Work OS",
  description: "Workplan을 대체하기 위한 검색 중심 업무 협업 플랫폼"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
