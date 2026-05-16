import { formatCurrencyPHP } from "@/lib/currency";

type PaymentTermsProps = {
  downPayment: number;
  remainingBalance: number;
  paymentMethodNotes: string;
  compact?: boolean;
};

export function PaymentTerms({ downPayment, remainingBalance, paymentMethodNotes, compact = false }: PaymentTermsProps) {
  return (
    <section className="avoid-break">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-clinic-teal">Payment terms</h3>
      <div className={compact ? "mt-2 grid gap-2 text-[11px]" : "mt-3 grid gap-3 text-sm"}>
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-clinic-line p-3">
          <span className="text-clinic-muted">Down payment</span>
          <strong className="text-right text-clinic-ink">{formatCurrencyPHP(downPayment)}</strong>
          <span className="text-clinic-muted">Remaining balance</span>
          <strong className="text-right text-clinic-ink">{formatCurrencyPHP(remainingBalance)}</strong>
        </div>
        <p className="leading-5 text-clinic-ink">{paymentMethodNotes}</p>
        <p className="leading-5 text-clinic-ink">
          Reservation and scheduling are confirmed according to clinic policy after the required down payment and
          coordination with the clinic team.
        </p>
      </div>
    </section>
  );
}
