import { NextResponse } from "next/server";
import { listServiceTemplates, upsertServiceTemplate } from "@/lib/serviceRepository";
import type { ServiceTemplate } from "@/types/quote";

export async function GET() {
  const { services, source } = await listServiceTemplates();

  return NextResponse.json({ services, source });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ServiceTemplate>;
  const service = normalizeServiceTemplate(body);

  if (!service.id || !service.name || !service.category || !service.packageType) {
    return NextResponse.json({ error: "Service ID, name, category, and package type are required." }, { status: 400 });
  }

  try {
    const savedService = await upsertServiceTemplate(service);

    return NextResponse.json({ service: savedService }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Service template could not be saved." },
      { status: 500 }
    );
  }
}

function normalizeServiceTemplate(body: Partial<ServiceTemplate>): ServiceTemplate {
  return {
    id: String(body.id || "").trim(),
    name: String(body.name || "").trim(),
    category: String(body.category || "").trim(),
    regularPrice: Number(body.regularPrice || 0),
    packageType: String(body.packageType || "").trim(),
    inclusions: normalizeLines(body.inclusions),
    conditionalItems: normalizeLines(body.conditionalItems),
    standardNotes: normalizeLines(body.standardNotes),
    disclaimer: String(body.disclaimer || "").trim(),
    paymentMethodNotes: String(body.paymentMethodNotes || "").trim(),
    isActive: body.isActive !== false,
    sortOrder: Number(body.sortOrder || 0)
  };
}

function normalizeLines(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item).trim()).filter(Boolean);
}
