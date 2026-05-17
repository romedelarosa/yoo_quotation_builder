import { NextResponse } from "next/server";
import { seedDefaultServiceTemplates } from "@/lib/serviceRepository";

export async function POST() {
  try {
    const services = await seedDefaultServiceTemplates();

    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Default services could not be seeded." },
      { status: 500 }
    );
  }
}
