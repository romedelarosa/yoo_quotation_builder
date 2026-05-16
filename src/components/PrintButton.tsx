type PrintButtonProps = {
  onBeforePrint?: () => void;
  onSavePdf?: () => Promise<void> | void;
  isSavingPdf?: boolean;
};

export function PrintButton({ onBeforePrint, onSavePdf, isSavingPdf = false }: PrintButtonProps) {
  function handlePrint() {
    onBeforePrint?.();
    window.print();
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex w-full items-center justify-center rounded-2xl border border-clinic-teal px-5 py-3 text-sm font-semibold text-clinic-teal transition hover:bg-clinic-soft"
      >
        Print
      </button>
      <button
        type="button"
        onClick={onSavePdf}
        disabled={!onSavePdf || isSavingPdf}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-clinic-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#127373] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSavingPdf ? "Preparing PDF..." : "Save 1-page PDF"}
      </button>
    </div>
  );
}
