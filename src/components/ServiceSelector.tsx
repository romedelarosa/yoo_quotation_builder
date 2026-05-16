import type { ServiceTemplate } from "@/types/quote";

type ServiceSelectorProps = {
  services: ServiceTemplate[];
  selectedServiceId: string;
  onChange: (serviceId: string) => void;
};

export function ServiceSelector({ services, selectedServiceId, onChange }: ServiceSelectorProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-clinic-ink">Service</span>
      <select
        value={selectedServiceId}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-clinic-line bg-white px-4 py-3 text-sm text-clinic-ink outline-none transition focus:border-clinic-teal focus:ring-4 focus:ring-clinic-soft"
      >
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name} - {service.category}
          </option>
        ))}
      </select>
    </label>
  );
}
