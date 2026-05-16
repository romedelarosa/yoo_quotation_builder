import { formatCurrencyPHP } from "@/lib/currency";

type PriceSummaryCardProps = {
  regularPrice: number;
  discountAmount: number;
  discountLabel: string;
  finalPackagePrice: number;
  downPayment: number;
  remainingBalance: number;
};

export function PriceSummaryCard({
  regularPrice,
  discountAmount,
  discountLabel,
  finalPackagePrice,
  downPayment,
  remainingBalance
}: PriceSummaryCardProps) {
  const rows = [
    ["Regular package price", formatCurrencyPHP(regularPrice)],
    [discountLabel || "Courtesy adjustment", `-${formatCurrencyPHP(discountAmount)}`],
    ["Down payment", formatCurrencyPHP(downPayment)]
  ];

  return (
    <section className="rounded-3xl border border-clinic-line bg-clinic-wash p-5">
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-clinic-teal">Live price summary</h2>
      <div className="mt-4 space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 text-sm">
            <span className="text-clinic-muted">{label}</span>
            <span className="font-semibold text-clinic-ink">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-clinic-muted">Final package price</span>
          <span className="text-xl font-semibold text-clinic-ink">{formatCurrencyPHP(finalPackagePrice)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-4 border-t border-clinic-line pt-3">
          <span className="text-sm font-medium text-clinic-muted">Remaining balance</span>
          <span className="text-lg font-semibold text-clinic-teal">{formatCurrencyPHP(remainingBalance)}</span>
        </div>
      </div>
    </section>
  );
}
