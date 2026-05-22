import Image from "next/image";
import { formatCurrencyPHP } from "@/lib/currency";
import type { QuoteDraft, ServiceTemplate } from "@/types/quote";

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
      className="print-sheet quote-document border border-[#b9c5c7] bg-white p-6 text-[#111827] shadow-soft lg:p-8"
    >
      <header className="quote-header grid gap-4 border-b-2 border-[#111827] pb-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="min-w-0">
          <Image
            src="/assets/yoo-logo-turquoise-transparent.png"
            alt="YOO Plastic Surgery and Aesthetics Clinic"
            width={320}
            height={80}
            className="quote-logo h-auto w-40"
            priority
          />
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#66727d]">
            Patient quotation record
          </p>
        </div>
        <div className="quote-date min-w-40 border border-[#111827] text-right">
          <p className="bg-[#111827] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            Date prepared
          </p>
          <p className="px-4 py-3 text-sm font-bold text-[#111827]">{datePrepared}</p>
        </div>
      </header>

      <section className="avoid-break mt-5">
        <div className="bg-[#111827] px-3 py-1.5 text-center text-xs font-bold uppercase tracking-[0.08em] text-white">
          Procedure Quotation Sheet
        </div>
        <div className="grid border-x border-b border-[#111827] text-xs md:grid-cols-2">
          <Info label="Patient name" value={quote.patientName || "Patient name"} />
          <Info label="Recommended procedure" value={service.name} />
          <Info label="Package type" value={service.packageType} />
          <Info label="Prepared by" value={quote.preparedBy || "YOO Clinic Team"} />
          <Info label="Quote validity" value={quote.quoteValidity || "Subject to clinic confirmation"} />
          <Info label="Service category" value={service.category} />
        </div>
      </section>

      <section className="avoid-break mt-4 grid border border-[#111827] text-xs md:grid-cols-3">
        <PriceBlock label="Regular package price" value={formatCurrencyPHP(service.regularPrice)} />
        <PriceBlock
          label={quote.discountLabel || "Discount or courtesy adjustment"}
          value={`-${formatCurrencyPHP(quote.discountAmount)}`}
        />
        <PriceBlock label="Final package price" value={formatCurrencyPHP(finalPackagePrice)} emphasized />
      </section>

      <DocumentList title="Included in the package" items={service.inclusions} marker="included" />
      <DocumentList title="Conditional or separate items" items={service.conditionalItems} marker="conditional" />

      <section className="avoid-break mt-4">
        <SectionTitle title="Payment terms" />
        <div className="border border-[#111827] text-[11px]">
          <div className="grid grid-cols-[1fr_140px] border-b border-[#111827]">
            <span className="px-3 py-2 text-[#4b5563]">Down payment</span>
            <strong className="border-l border-[#111827] px-3 py-2 text-right">{formatCurrencyPHP(quote.downPayment)}</strong>
          </div>
          <div className="grid grid-cols-[1fr_140px]">
            <span className="px-3 py-2 text-[#4b5563]">Remaining balance</span>
            <strong className="border-l border-[#111827] px-3 py-2 text-right">{formatCurrencyPHP(remainingBalance)}</strong>
          </div>
        </div>
        <p className="mt-2 text-[10px] leading-4 text-[#111827]">{service.paymentMethodNotes}</p>
        <p className="mt-1 text-[10px] leading-4 text-[#111827]">
          Reservation and scheduling are confirmed according to clinic policy after the required down payment and
          coordination with the clinic team.
        </p>
      </section>

      <DocumentNote
        title="Professional note"
        text="This quotation is structured as an inclusive package to give the patient clearer cost visibility for the recommended procedure, expected inclusions, coordinated clinic care, and payment planning."
      />
      <DocumentNote title="Medical disclaimer" text={service.disclaimer} />

      {quote.customNotes ? (
        <section className="avoid-break mt-4">
          <SectionTitle title="Custom notes" />
          <p className="border border-[#111827] px-3 py-2 text-[10px] leading-4 text-[#111827]">{quote.customNotes}</p>
        </section>
      ) : null}

      <footer className="mt-8 grid grid-cols-2 gap-12 text-center text-[10px] text-[#111827]">
        <div className="border-t border-[#111827] pt-2">Prepared by</div>
        <div className="border-t border-[#111827] pt-2">Patient acknowledgment</div>
      </footer>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-14 border-b border-[#d7dee0] px-3 py-2 md:odd:border-r md:odd:border-[#d7dee0]">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#66727d]">{label}</p>
      <p className="mt-1 text-[11px] font-bold leading-4 text-[#111827]">{value}</p>
    </div>
  );
}

function PriceBlock({ label, value, emphasized = false }: { label: string; value: string; emphasized?: boolean }) {
  return (
    <div className="border-b border-[#111827] p-3 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#66727d]">{label}</p>
      <p className={emphasized ? "mt-2 text-lg font-bold text-clinic-teal" : "mt-2 text-base font-bold text-[#111827]"}>
        {value}
      </p>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className="bg-[#111827] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white">{title}</h3>;
}

function DocumentList({
  title,
  items,
  marker
}: {
  title: string;
  items: string[];
  marker: "included" | "conditional";
}) {
  return (
    <section className="avoid-break mt-4">
      <SectionTitle title={title} />
      <ul className="border-x border-b border-[#111827] text-[10px]">
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[22px_1fr] border-b border-[#e4e9ea] last:border-b-0">
            <span className="grid place-items-center border-r border-[#d7dee0] py-1.5">
              <span
                className={
                  marker === "included"
                    ? "h-2.5 w-2.5 rounded-full bg-clinic-teal"
                    : "h-2.5 w-2.5 rounded-full border border-[#9aa7ad]"
                }
              />
            </span>
            <span className="px-2 py-1.5 leading-4 text-[#111827]">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DocumentNote({ title, text }: { title: string; text: string }) {
  return (
    <section className="avoid-break mt-4">
      <SectionTitle title={title} />
      <p className="border-x border-b border-[#111827] px-3 py-2 text-[10px] leading-4 text-[#111827]">{text}</p>
    </section>
  );
}
