import { NextResponse } from "next/server";

import { listIntegrationSummaries } from "@/features/integrations/erp-repository";

export function GET() {
  return NextResponse.json({
    data: listIntegrationSummaries()
  });
}
