import { useMemo, useState } from "react";
import { formatCurrencyPHP } from "@/lib/currency";
import type { QuoteDraft, SavedQuote, ServiceTemplate } from "@/types/quote";

type QuoteHistoryProps = {
  quotes: SavedQuote[];
  services: ServiceTemplate[];
  onRefresh: () => Promise<void> | void;
  onLoadQuote: (quote: SavedQuote) => void;
};

export function QuoteHistory({ quotes, services, onRefresh, onLoadQuote }: QuoteHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const serviceNameById = useMemo(
    () => new Map(services.map((service) => [service.id, service.name])),
    [services]
  );

  const filteredQuotes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return quotes;
    }

    return quotes.filter((quote) => {
      const serviceName = serviceNameById.get(quote.serviceId) || "";
      return [
        quote.patientName,
        quote.preparedBy,
        quote.discountLabel,
        serviceName,
        quote.createdAt
      ].some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [quotes, searchTerm, serviceNameById]);

  function exportCsv() {
    if (filteredQuotes.length === 0) {
      return;
    }

    const headers = [
      "Created At",
      "Patient Name",
      "Service",
      "Prepared By",
      "Discount",
      "Down Payment",
      "Final Package Price",
      "Remaining Balance"
    ];
    const rows = filteredQuotes.map((quote) => [
      formatDateTime(quote.createdAt),
      quote.patientName,
      serviceNameById.get(quote.serviceId) || quote.serviceId,
      quote.preparedBy,
      quote.discountAmount,
      quote.downPayment,
      quote.finalPackagePrice,
      quote.remainingBalance
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `yoo-quotes-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="no-print rounded-[28px] border border-clinic-line bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 border-b border-clinic-line pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-clinic-teal">Session history</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-clinic-ink">Recent quotes</h2>
          <p className="mt-1 text-sm text-clinic-muted">Saved records are kept until the server restarts.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-full border border-clinic-line px-4 py-2 text-sm font-semibold text-clinic-ink transition hover:border-clinic-teal hover:text-clinic-teal"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={filteredQuotes.length === 0}
            className="rounded-full bg-clinic-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-clinic-teal disabled:cursor-not-allowed disabled:bg-clinic-line disabled:text-clinic-muted"
          >
            Export CSV
          </button>
        </div>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-clinic-ink">Search quotes</span>
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Patient, service, prepared by..."
          className="mt-2 w-full rounded-2xl border border-clinic-line px-4 py-3 text-sm outline-none transition focus:border-clinic-teal focus:ring-4 focus:ring-clinic-soft"
        />
      </label>

      <div className="mt-4 overflow-hidden rounded-2xl border border-clinic-line">
        {filteredQuotes.length > 0 ? (
          <div className="max-h-80 overflow-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-clinic-wash text-[11px] uppercase tracking-[0.12em] text-clinic-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Patient</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Final price</th>
                  <th className="px-4 py-3 font-semibold">Balance</th>
                  <th className="px-4 py-3 font-semibold">Saved</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clinic-line">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.id} className="bg-white">
                    <td className="px-4 py-3 font-semibold text-clinic-ink">{quote.patientName || "Unnamed patient"}</td>
                    <td className="px-4 py-3 text-clinic-muted">{serviceNameById.get(quote.serviceId) || quote.serviceId}</td>
                    <td className="px-4 py-3 font-semibold text-clinic-ink">{formatCurrencyPHP(quote.finalPackagePrice)}</td>
                    <td className="px-4 py-3 text-clinic-muted">{formatCurrencyPHP(quote.remainingBalance)}</td>
                    <td className="px-4 py-3 text-clinic-muted">{formatDateTime(quote.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onLoadQuote(quote)}
                        className="rounded-full border border-clinic-line px-3 py-1.5 text-xs font-semibold text-clinic-ink transition hover:border-clinic-teal hover:text-clinic-teal"
                      >
                        Load
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="bg-clinic-wash px-4 py-8 text-center text-sm text-clinic-muted">
            {quotes.length === 0 ? "No saved quote records yet." : "No quotes match this search."}
          </p>
        )}
      </div>
    </section>
  );
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function escapeCsvCell(value: string | number): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function quoteDraftFromSavedQuote(quote: SavedQuote): QuoteDraft {
  return {
    patientName: quote.patientName,
    preparedBy: quote.preparedBy,
    discountAmount: quote.discountAmount,
    discountLabel: quote.discountLabel,
    downPayment: quote.downPayment,
    quoteValidity: quote.quoteValidity,
    serviceScope: quote.serviceScope || "",
    customNotes: quote.customNotes
  };
}
