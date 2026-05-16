type MedicalDisclaimerProps = {
  disclaimer: string;
  compact?: boolean;
};

export function MedicalDisclaimer({ disclaimer, compact = false }: MedicalDisclaimerProps) {
  return (
    <section className="avoid-break rounded-2xl border border-clinic-line p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-clinic-teal">Medical disclaimer</h3>
      <p className={compact ? "mt-2 text-[11px] leading-5 text-clinic-ink" : "mt-2 text-sm leading-6 text-clinic-ink"}>
        {disclaimer}
      </p>
    </section>
  );
}
