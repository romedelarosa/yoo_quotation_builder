type InclusionChecklistProps = {
  items: string[];
  compact?: boolean;
};

export function InclusionChecklist({ items, compact = false }: InclusionChecklistProps) {
  return (
    <section className="avoid-break">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-clinic-teal">Included in the package</h3>
      <ul className={compact ? "mt-2 grid gap-1.5 text-[11px]" : "mt-3 grid gap-2 text-sm"}>
        {items.map((item) => (
          <li key={item} className="flex gap-2 leading-5 text-clinic-ink">
            <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-clinic-soft text-[10px] font-bold text-clinic-teal">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
