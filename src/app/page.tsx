"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ConditionalItemsChecklist } from "@/components/ConditionalItemsChecklist";
import { InclusionChecklist } from "@/components/InclusionChecklist";
import { PrintableQuote } from "@/components/PrintableQuote";
import { QuoteHistory, quoteDraftFromSavedQuote } from "@/components/QuoteHistory";
import { QuoteForm } from "@/components/QuoteForm";
import { saveQuoteAsOnePagePdf } from "@/lib/pdf";
import { calculateBalance, calculateFinalPrice } from "@/lib/pricing";
import type { QuoteDraft, SavedQuote, ServiceTemplate } from "@/types/quote";

const initialQuote: QuoteDraft = {
  patientName: "",
  preparedBy: "",
  discountAmount: 0,
  discountLabel: "Courtesy adjustment",
  downPayment: 0,
  quoteValidity: "Valid for 14 days from date prepared",
  customNotes: ""
};

async function fetchSavedQuotes(): Promise<SavedQuote[]> {
  const response = await fetch("/api/quotes");

  if (!response.ok) {
    throw new Error("Unable to load quotes.");
  }

  const data = (await response.json()) as { quotes: SavedQuote[] };
  return data.quotes;
}

export default function Home() {
  const [services, setServices] = useState<ServiceTemplate[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [quote, setQuote] = useState<QuoteDraft>(initialQuote);
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [datePrepared, setDatePrepared] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [isSavingPdf, setIsSavingPdf] = useState(false);

  useEffect(() => {
    setDatePrepared(
      new Intl.DateTimeFormat("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(new Date())
    );

    async function loadWorkspaceData() {
      const [servicesResponse, quotes] = await Promise.all([fetch("/api/services"), fetchSavedQuotes()]);

      if (!servicesResponse.ok) {
        throw new Error("Unable to load services.");
      }

      const data = (await servicesResponse.json()) as { services: ServiceTemplate[] };
      setServices(data.services);
      setSavedQuotes(quotes);
      setSelectedServiceId(data.services[1]?.id || data.services[0]?.id || "");
    }

    loadWorkspaceData().catch(() => setSaveStatus("Unable to load workspace data. Please refresh the page."));
  }, []);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) || services[0],
    [services, selectedServiceId]
  );

  const finalPackagePrice = selectedService
    ? calculateFinalPrice(selectedService.regularPrice, quote.discountAmount)
    : 0;
  const remainingBalance = calculateBalance(finalPackagePrice, quote.downPayment);

  async function loadSavedQuotes() {
    try {
      setSavedQuotes(await fetchSavedQuotes());
      setSaveStatus("Quote history refreshed.");
    } catch {
      setSaveStatus("Quote history could not be refreshed.");
    }
  }

  async function saveQuote(): Promise<boolean> {
    if (!selectedService) {
      return false;
    }

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          ...quote
        })
      });

      if (!response.ok) {
        setSaveStatus("Quote could not be saved.");
        return false;
      }

      const data = (await response.json()) as { quote: SavedQuote };
      setSavedQuotes((currentQuotes) => [
        data.quote,
        ...currentQuotes.filter((currentQuote) => currentQuote.id !== data.quote.id)
      ]);
      setSaveStatus("Quote record saved for this session.");
      return true;
    } catch {
      setSaveStatus("Quote could not be saved.");
      return false;
    }
  }

  function loadQuoteIntoForm(savedQuote: SavedQuote) {
    setSelectedServiceId(savedQuote.serviceId);
    setQuote(quoteDraftFromSavedQuote(savedQuote));
    setSaveStatus("Saved quote loaded into the builder.");
  }

  async function handleSavePdf() {
    if (!selectedService || isSavingPdf) {
      return;
    }

    setIsSavingPdf(true);
    setSaveStatus("");

    try {
      const wasRecordSaved = await saveQuote();
      await saveQuoteAsOnePagePdf(quote, selectedService.name);
      setSaveStatus(wasRecordSaved ? "PDF saved as a one-page A4 file." : "PDF saved, but the quote record was not saved.");
    } catch {
      setSaveStatus("PDF could not be created. Please try Print as a fallback.");
    } finally {
      setIsSavingPdf(false);
    }
  }

  if (!selectedService) {
    return (
      <AppShell>
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <p className="rounded-3xl border border-clinic-line p-6 text-sm text-clinic-muted">Loading quote builder...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="print-page mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[390px_1fr] lg:px-8 lg:py-8">
        <QuoteForm
          services={services}
          selectedService={selectedService}
          selectedServiceId={selectedServiceId}
          quote={quote}
          finalPackagePrice={finalPackagePrice}
          remainingBalance={remainingBalance}
          isSavingPdf={isSavingPdf}
          onServiceChange={setSelectedServiceId}
          onQuoteChange={setQuote}
          onSaveQuote={saveQuote}
          onSavePdf={handleSavePdf}
        />

        <section className="space-y-5">
          <div className="no-print rounded-[28px] border border-clinic-line bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-3 border-b border-clinic-line pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-clinic-teal">Template preview</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-clinic-ink">{selectedService.name}</h2>
                <p className="mt-1 text-sm text-clinic-muted">{selectedService.packageType}</p>
              </div>
              {saveStatus ? <p className="text-sm font-medium text-clinic-teal">{saveStatus}</p> : null}
            </div>
            <div className="mt-5 grid gap-5 xl:grid-cols-2">
              <InclusionChecklist items={selectedService.inclusions} />
              <ConditionalItemsChecklist items={selectedService.conditionalItems} />
            </div>
          </div>

          <QuoteHistory
            quotes={savedQuotes}
            services={services}
            onRefresh={loadSavedQuotes}
            onLoadQuote={loadQuoteIntoForm}
          />

          <PrintableQuote
            service={selectedService}
            quote={quote}
            finalPackagePrice={finalPackagePrice}
            remainingBalance={remainingBalance}
            datePrepared={datePrepared}
          />
        </section>
      </div>
    </AppShell>
  );
}
