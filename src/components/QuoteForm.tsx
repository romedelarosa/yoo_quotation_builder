import type { QuoteDraft, ServiceTemplate } from "@/types/quote";
import { PriceSummaryCard } from "./PriceSummaryCard";
import { PrintButton } from "./PrintButton";
import { ServiceSelector } from "./ServiceSelector";

type QuoteFormProps = {
  services: ServiceTemplate[];
  selectedService: ServiceTemplate;
  selectedServiceId: string;
  quote: QuoteDraft;
  finalPackagePrice: number;
  remainingBalance: number;
  isSavingPdf: boolean;
  onServiceChange: (serviceId: string) => void;
  onQuoteChange: (quote: QuoteDraft) => void;
  onSaveQuote: () => void;
  onSavePdf: () => Promise<void> | void;
};

export function QuoteForm({
  services,
  selectedService,
  selectedServiceId,
  quote,
  finalPackagePrice,
  remainingBalance,
  isSavingPdf,
  onServiceChange,
  onQuoteChange,
  onSaveQuote,
  onSavePdf
}: QuoteFormProps) {
  function update<K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) {
    onQuoteChange({ ...quote, [key]: value });
  }

  return (
    <aside className="no-print rounded-[28px] border border-clinic-line bg-white p-5 shadow-soft lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-clinic-ink">Build a quotation</h1>
        <p className="mt-2 text-sm leading-6 text-clinic-muted">
          Select a service, add basic patient and payment details, then print or save the generated sheet as PDF.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <ServiceSelector services={services} selectedServiceId={selectedServiceId} onChange={onServiceChange} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <TextField label="Patient name" value={quote.patientName} onChange={(value) => update("patientName", value)} />
          <TextField label="Prepared by" value={quote.preparedBy} onChange={(value) => update("preparedBy", value)} />
          <MoneyField
            label="Discount amount"
            value={quote.discountAmount}
            onChange={(value) => update("discountAmount", value)}
          />
          <TextField
            label="Discount label"
            value={quote.discountLabel}
            onChange={(value) => update("discountLabel", value)}
          />
          <MoneyField label="Down payment" value={quote.downPayment} onChange={(value) => update("downPayment", value)} />
          <TextField
            label="Quote validity"
            value={quote.quoteValidity}
            onChange={(value) => update("quoteValidity", value)}
            placeholder="e.g. Valid for 14 days"
          />
        </div>
        <label className="block">
          <span className="text-sm font-semibold text-clinic-ink">Optional custom notes</span>
          <textarea
            value={quote.customNotes}
            onChange={(event) => update("customNotes", event.target.value)}
            rows={4}
            className="mt-2 w-full resize-none rounded-2xl border border-clinic-line px-4 py-3 text-sm outline-none transition focus:border-clinic-teal focus:ring-4 focus:ring-clinic-soft"
            placeholder="Add patient-specific payment or coordination notes."
          />
        </label>
        <PriceSummaryCard
          regularPrice={selectedService.regularPrice}
          discountAmount={quote.discountAmount}
          discountLabel={quote.discountLabel}
          finalPackagePrice={finalPackagePrice}
          downPayment={quote.downPayment}
          remainingBalance={remainingBalance}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <button
            type="button"
            onClick={onSaveQuote}
            className="rounded-2xl border border-clinic-line px-5 py-3 text-sm font-semibold text-clinic-ink transition hover:border-clinic-teal hover:text-clinic-teal"
          >
            Save MVP quote record
          </button>
          <PrintButton onBeforePrint={onSaveQuote} onSavePdf={onSavePdf} isSavingPdf={isSavingPdf} />
        </div>
      </div>
    </aside>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-clinic-ink">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-clinic-line px-4 py-3 text-sm outline-none transition focus:border-clinic-teal focus:ring-4 focus:ring-clinic-soft"
      />
    </label>
  );
}

function MoneyField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-clinic-ink">{label}</span>
      <input
        value={value || ""}
        min={0}
        type="number"
        inputMode="decimal"
        onChange={(event) => onChange(Number(event.target.value || 0))}
        className="mt-2 w-full rounded-2xl border border-clinic-line px-4 py-3 text-sm outline-none transition focus:border-clinic-teal focus:ring-4 focus:ring-clinic-soft"
      />
    </label>
  );
}
