import { NextResponse } from "next/server";
import { getServiceById, listQuotes, saveQuote } from "@/lib/db";
import { calculateBalance, calculateFinalPrice } from "@/lib/pricing";

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
    customNotes?: string;
  };

  if (!body.serviceId || !getServiceById(body.serviceId)) {
    return NextResponse.json({ error: "A valid service is required." }, { status: 400 });
  }

  const service = getServiceById(body.serviceId);
  const discountAmount = Number(body.discountAmount || 0);
  const downPayment = Number(body.downPayment || 0);
  const finalPackagePrice = calculateFinalPrice(service?.regularPrice || 0, discountAmount);
  const remainingBalance = calculateBalance(finalPackagePrice, downPayment);

  const savedQuote = saveQuote({
    serviceId: body.serviceId,
    patientName: body.patientName || "",
    preparedBy: body.preparedBy || "",
    discountAmount,
    discountLabel: body.discountLabel || "Courtesy adjustment",
    downPayment,
    quoteValidity: body.quoteValidity || "",
    customNotes: body.customNotes || "",
    finalPackagePrice,
    remainingBalance
  });

  return NextResponse.json({ quote: savedQuote }, { status: 201 });
}
