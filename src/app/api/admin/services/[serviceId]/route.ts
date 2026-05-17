import { NextResponse } from "next/server";
import { archiveServiceTemplate } from "@/lib/serviceRepository";

export async function DELETE(_request: Request, { params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params;

  try {
    await archiveServiceTemplate(serviceId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Service template could not be archived." },
      { status: 500 }
    );
  }
}
