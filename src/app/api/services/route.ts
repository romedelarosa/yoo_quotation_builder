import { NextResponse } from "next/server";
import { listServiceTemplates } from "@/lib/serviceRepository";

export async function GET() {
  const { services, source } = await listServiceTemplates();

  return NextResponse.json({ services, source });
}
