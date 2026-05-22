import { NextResponse } from "next/server";
import { listQuotes, saveQuote } from "@/lib/db";
import { calculateBalance, calculateFinalPrice } from "@/lib/pricing";
import { findServiceTemplateById } from "@/lib/serviceRepository";

export async function GET() {
  return NextResponse.json({ quotes: listQuotes() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    serviceId?: string;
    patientName?: string;
    preparedBy?: string;
    discountAmount?: number;
    discountLabel?: string;
    downPayment?: number;
    quoteValidity?: string;
    serviceScope?: string;
    customNotes?: string;
  };

  const service = body.serviceId ? await findServiceTemplateById(body.serviceId) : undefined;

  if (!body.serviceId || !service) {
    return NextResponse.json({ error: "A valid service is required." }, { status: 400 });
  }

  const discountAmount = Number(body.discountAmount || 0);
  const downPayment = Number(body.downPayment || 0);
  const finalPackagePrice = calculateFinalPrice(service.regularPrice, discountAmount);
  const remainingBalance = calculateBalance(finalPackagePrice, downPayment);

  const savedQuote = saveQuote({
    serviceId: body.serviceId,
    patientName: body.patientName || "",
    preparedBy: body.preparedBy || "",
    discountAmount,
    discountLabel: body.discountLabel || "Courtesy adjustment",
    downPayment,
    quoteValidity: body.quoteValidity || "",
    serviceScope: body.serviceScope || "",
    customNotes: body.customNotes || "",
    finalPackagePrice,
    remainingBalance
  });

  return NextResponse.json({ quote: savedQuote }, { status: 201 });
}
