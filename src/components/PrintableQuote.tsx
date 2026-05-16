import Image from "next/image";
import { formatCurrencyPHP } from "@/lib/currency";
import type { QuoteDraft, ServiceTemplate } from "@/types/quote";
import { ConditionalItemsChecklist } from "./ConditionalItemsChecklist";
import { InclusionChecklist } from "./InclusionChecklist";
import { MedicalDisclaimer } from "./MedicalDisclaimer";
import { PaymentTerms } from "./PaymentTerms";
import { ProfessionalNote } from "./ProfessionalNote";

type PrintableQuoteProps = {
  service: ServiceTemplate;
  quote: QuoteDraft;
  finalPackagePrice: number;
  remainingBalance: number;
  datePrepared: string;
};

export function PrintableQuote({
  service,
  quote,
  finalPackagePrice,
  remainingBalance,
  datePrepared
}: PrintableQuoteProps) {
  return (
    <article
      id="printable-quote-sheet"
      className="print-sheet rounded-[28px] border border-clinic-line bg-white p-6 shadow-soft lg:p-8"
    >
      <header className="flex items-start justify-between gap-5 border-b border-clinic-line pb-5">
        <div>
          <Image src="/assets/yoo-logo.svg" alt="YOO Clinic" width={138} height={69} className="h-auto w-32" priority />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-clinic-ink">Procedure Quotation Sheet</h1>
          <p className="mt-1 text-sm text-clinic-muted">YOO Plastic Surgery and Aesthetics Clinic</p>
        </div>
        <div className="rounded-2xl bg-clinic-soft px-4 py-3 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-clinic-teal">Date prepared</p>
          <p className="mt-1 text-sm font-semibold text-clinic-ink">{datePrepared}</p>
        </div>
      </header>

      <section className="avoid-break mt-5 grid gap-3 rounded-2xl border border-clinic-line p-4 text-sm md:grid-cols-2">
        <Info label="Patient name" value={quote.patientName || "Patient name"} />
        <Info label="Recommended procedure" value={service.name} />
        <Info label="Package type" value={service.packageType} />
        <Info label="Prepared by" value={quote.preparedBy || "YOO Clinic Team"} />
        <Info label="Quote validity" value={quote.quoteValidity || "Subject to clinic confirmation"} />
        <Info label="Service category" value={service.category} />
      </section>

      <section className="avoid-break mt-5 grid gap-3 rounded-2xl bg-clinic-wash p-4 text-sm md:grid-cols-3">
        <PriceBlock label="Regular package price" value={formatCurrencyPHP(service.regularPrice)} />
        <PriceBlock
          label={quote.discountLabel || "Discount or courtesy adjustment"}
          value={`-${formatCurrencyPHP(quote.discountAmount)}`}
        />
        <PriceBlock label="Final package price" value={formatCurrencyPHP(finalPackagePrice)} emphasized />
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <InclusionChecklist items={service.inclusions} compact />
        <ConditionalItemsChecklist items={service.conditionalItems} compact />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <PaymentTerms
          downPayment={quote.downPayment}
          remainingBalance={remainingBalance}
          paymentMethodNotes={service.paymentMethodNotes}
          compact
        />
        <div className="grid gap-3">
          <ProfessionalNote compact />
          <MedicalDisclaimer disclaimer={service.disclaimer} compact />
        </div>
      </div>

      {quote.customNotes ? (
        <section className="avoid-break mt-5 rounded-2xl border border-clinic-line p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-clinic-teal">Custom notes</h3>
          <p className="mt-2 text-[11px] leading-5 text-clinic-ink">{quote.customNotes}</p>
        </section>
      ) : null}
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-clinic-muted">{label}</p>
      <p className="mt-1 font-semibold text-clinic-ink">{value}</p>
    </div>
  );
}

function PriceBlock({ label, value, emphasized = false }: { label: string; value: string; emphasized?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-clinic-muted">{label}</p>
      <p className={emphasized ? "mt-2 text-xl font-semibold text-clinic-teal" : "mt-2 text-lg font-semibold text-clinic-ink"}>
        {value}
      </p>
    </div>
  );
}
