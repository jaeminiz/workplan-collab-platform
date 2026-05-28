import { NextResponse } from "next/server";
import { z } from "zod";

import { listErpMappings, listIntegrationSummaries } from "@/features/integrations/erp-repository";

const erpSyncRequestSchema = z.object({
  erpSystem: z.string().min(1).max(80),
  entityType: z.enum([
    "customer",
    "project",
    "task",
    "purchase_order",
    "invoice",
    "inventory_item",
    "shipment"
  ]),
  externalId: z.string().min(1).max(120),
  operation: z.enum(["upsert", "delete", "status_update"])
});

export function GET() {
  return NextResponse.json({
    integration: listIntegrationSummaries().find((item) => item.provider === "erp"),
    mappings: listErpMappings()
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsedPayload = erpSyncRequestSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return NextResponse.json(
      {
        error: "Invalid ERP sync request",
        issues: parsedPayload.error.flatten().fieldErrors
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    accepted: true,
    mode: "poc-dry-run",
    event: parsedPayload.data,
    message: "ERP sync request validated. Persistence and queue processing will be added after Supabase setup."
  });
}
