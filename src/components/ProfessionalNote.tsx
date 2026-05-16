type ProfessionalNoteProps = {
  compact?: boolean;
};

export function ProfessionalNote({ compact = false }: ProfessionalNoteProps) {
  return (
    <section className="avoid-break rounded-2xl border border-clinic-line bg-clinic-wash p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-clinic-teal">Professional note</h3>
      <p className={compact ? "mt-2 text-[11px] leading-5 text-clinic-ink" : "mt-2 text-sm leading-6 text-clinic-ink"}>
        This quotation is structured as an inclusive package to give the patient clearer cost visibility for the
        recommended procedure, expected inclusions, coordinated clinic care, and payment planning.
      </p>
    </section>
  );
}
