type ConditionalItemsChecklistProps = {
  items: string[];
  compact?: boolean;
};

export function ConditionalItemsChecklist({ items, compact = false }: ConditionalItemsChecklistProps) {
  return (
    <section className="avoid-break">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-clinic-teal">
        Conditional or separate items
      </h3>
      <ul className={compact ? "mt-2 grid gap-1.5 text-[11px]" : "mt-3 grid gap-2 text-sm"}>
        {items.map((item) => (
          <li key={item} className="flex gap-2 leading-5 text-clinic-ink">
            <span className="mt-1 h-4 w-4 shrink-0 rounded-full border border-clinic-line bg-white" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
