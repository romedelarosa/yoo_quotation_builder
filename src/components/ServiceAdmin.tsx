"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrencyPHP } from "@/lib/currency";
import type { ServiceTemplate } from "@/types/quote";

type ServiceResponse = {
  services: ServiceTemplate[];
  source?: "supabase" | "fallback";
};

const emptyService: ServiceTemplate = {
  id: "",
  name: "",
  category: "",
  regularPrice: 0,
  packageType: "",
  inclusions: [],
  conditionalItems: [],
  standardNotes: [
    "This quotation is structured as a package to help the patient review expected inclusions clearly.",
    "The care plan remains doctor-led and may be adjusted after assessment."
  ],
  disclaimer:
    "Final surgical plan, eligibility, and pricing remain subject to physician assessment, patient history, physical examination, laboratory requirements, and medical clearance when applicable.",
  paymentMethodNotes:
    "Payments may be made through clinic-approved payment channels. Exact payment method availability and processing schedules may be confirmed with the clinic team.",
  isActive: true,
  sortOrder: 0
};

export function ServiceAdmin() {
  const [services, setServices] = useState<ServiceTemplate[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [draft, setDraft] = useState<ServiceTemplate>(emptyService);
  const [source, setSource] = useState<"supabase" | "fallback">("fallback");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("Loading services...");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return services;
    }

    return services.filter((service) =>
      [service.name, service.category, service.packageType, service.id].some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      )
    );
  }, [searchTerm, services]);

  async function loadServices() {
    try {
      const response = await fetch("/api/admin/services");
      const data = (await response.json()) as ServiceResponse;

      setServices(data.services);
      setSource(data.source || "fallback");
      setStatus(data.source === "supabase" ? "Loaded from Supabase." : "Using local fallback templates.");

      if (data.services.length > 0) {
        selectService(data.services[0]);
      }
    } catch {
      setStatus("Services could not be loaded.");
    }
  }

  function selectService(service: ServiceTemplate) {
    setSelectedServiceId(service.id);
    setDraft({
      ...service,
      inclusions: [...service.inclusions],
      conditionalItems: [...service.conditionalItems],
      standardNotes: [...service.standardNotes]
    });
  }

  function startNewService() {
    setSelectedServiceId("");
    setDraft({ ...emptyService, id: "", sortOrder: services.length });
    setStatus("New service draft ready.");
  }

  function duplicateService() {
    const copyId = draft.id ? `${draft.id}-copy` : "";
    setSelectedServiceId("");
    setDraft({
      ...draft,
      id: copyId,
      name: draft.name ? `${draft.name} Copy` : "",
      sortOrder: services.length
    });
    setStatus("Duplicated as a new draft.");
  }

  async function seedDefaults() {
    setIsSaving(true);
    setStatus("Seeding current default templates...");

    try {
      const response = await fetch("/api/admin/services/seed", { method: "POST" });
      const data = (await response.json()) as ServiceResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Defaults could not be seeded.");
      }

      setServices(data.services);
      setSource("supabase");
      if (data.services.length > 0) {
        selectService(data.services[0]);
      }
      setStatus("Default templates seeded to Supabase.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Default templates could not be seeded.");
    } finally {
      setIsSaving(false);
    }
  }

  async function saveService() {
    setIsSaving(true);
    setStatus("Saving service template...");

    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft)
      });
      const data = (await response.json()) as { service?: ServiceTemplate; error?: string };

      if (!response.ok || !data.service) {
        throw new Error(data.error || "Service template could not be saved.");
      }

      setServices((currentServices) =>
        [data.service as ServiceTemplate, ...currentServices.filter((service) => service.id !== data.service?.id)].sort(
          (left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0) || left.name.localeCompare(right.name)
        )
      );
      selectService(data.service);
      setSource("supabase");
      setStatus("Service template saved to Supabase.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Service template could not be saved.");
    } finally {
      setIsSaving(false);
    }
  }

  async function archiveService() {
    if (!selectedServiceId) {
      return;
    }

    setIsSaving(true);
    setStatus("Archiving service template...");

    try {
      const response = await fetch(`/api/admin/services/${encodeURIComponent(selectedServiceId)}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Service template could not be archived.");
      }

      const remainingServices = services.filter((service) => service.id !== selectedServiceId);
      setServices(remainingServices);
      if (remainingServices.length > 0) {
        selectService(remainingServices[0]);
      } else {
        startNewService();
      }
      setStatus("Service template archived.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Service template could not be archived.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[360px_1fr] lg:px-8 lg:py-8">
      <aside className="rounded-[28px] border border-clinic-line bg-white p-5 shadow-soft lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-clinic-teal">Admin</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-clinic-ink">Service templates</h1>
            <p className="mt-2 text-sm leading-6 text-clinic-muted">
              Add or update pricing, inclusions, conditional items, payment notes, and disclaimers.
            </p>
          </div>
          <span className="rounded-full bg-clinic-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-clinic-teal">
            {source}
          </span>
        </div>

        <div className="mt-5 grid gap-3">
          <button
            type="button"
            onClick={seedDefaults}
            disabled={isSaving}
            className="rounded-2xl bg-clinic-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-clinic-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            Seed default templates
          </button>
          <button
            type="button"
            onClick={startNewService}
            className="rounded-2xl border border-clinic-line px-4 py-3 text-sm font-semibold text-clinic-ink transition hover:border-clinic-teal hover:text-clinic-teal"
          >
            New service
          </button>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-clinic-ink">Search</span>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-clinic-line px-4 py-3 text-sm outline-none transition focus:border-clinic-teal focus:ring-4 focus:ring-clinic-soft"
            placeholder="Service, category, package..."
          />
        </label>

        <div className="mt-5 grid gap-2">
          {filteredServices.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => selectService(service)}
              className={
                selectedServiceId === service.id
                  ? "rounded-2xl border border-clinic-teal bg-clinic-soft px-4 py-3 text-left"
                  : "rounded-2xl border border-clinic-line px-4 py-3 text-left transition hover:border-clinic-teal"
              }
            >
              <span className="block text-sm font-semibold text-clinic-ink">{service.name}</span>
              <span className="mt-1 block text-xs text-clinic-muted">
                {service.category} - {formatCurrencyPHP(service.regularPrice)}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="rounded-[28px] border border-clinic-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 border-b border-clinic-line pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-clinic-teal">Template editor</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-clinic-ink">
              {selectedServiceId ? draft.name : "New service"}
            </h2>
          </div>
          <p className="text-sm font-medium text-clinic-teal">{status}</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <TextField label="Service ID" value={draft.id} onChange={(value) => updateDraft("id", slugify(value))} />
          <NumberField label="Sort order" value={draft.sortOrder || 0} onChange={(value) => updateDraft("sortOrder", value)} />
          <TextField label="Service name" value={draft.name} onChange={(value) => updateDraft("name", value)} />
          <TextField label="Category" value={draft.category} onChange={(value) => updateDraft("category", value)} />
          <NumberField
            label="Regular price"
            value={draft.regularPrice}
            onChange={(value) => updateDraft("regularPrice", value)}
          />
          <TextField label="Package type" value={draft.packageType} onChange={(value) => updateDraft("packageType", value)} />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <LinesField
            label="Inclusions"
            value={draft.inclusions}
            onChange={(value) => updateDraft("inclusions", value)}
          />
          <LinesField
            label="Conditional or separate items"
            value={draft.conditionalItems}
            onChange={(value) => updateDraft("conditionalItems", value)}
          />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <LinesField
            label="Standard notes"
            value={draft.standardNotes}
            onChange={(value) => updateDraft("standardNotes", value)}
          />
          <LongTextField
            label="Payment method notes"
            value={draft.paymentMethodNotes}
            onChange={(value) => updateDraft("paymentMethodNotes", value)}
          />
        </div>

        <div className="mt-5">
          <LongTextField label="Medical disclaimer" value={draft.disclaimer} onChange={(value) => updateDraft("disclaimer", value)} />
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-clinic-line pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={duplicateService}
            className="rounded-2xl border border-clinic-line px-5 py-3 text-sm font-semibold text-clinic-ink transition hover:border-clinic-teal hover:text-clinic-teal"
          >
            Duplicate
          </button>
          <button
            type="button"
            onClick={archiveService}
            disabled={!selectedServiceId || isSaving}
            className="rounded-2xl border border-clinic-line px-5 py-3 text-sm font-semibold text-clinic-muted transition hover:border-clinic-teal hover:text-clinic-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            Archive
          </button>
          <button
            type="button"
            onClick={saveService}
            disabled={isSaving}
            className="rounded-2xl bg-clinic-teal px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#127373] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save template"}
          </button>
        </div>
      </section>
    </div>
  );

  function updateDraft<K extends keyof ServiceTemplate>(key: K, value: ServiceTemplate[K]) {
    setDraft((currentDraft) => ({ ...currentDraft, [key]: value }));
  }
}

function TextField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-clinic-ink">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-clinic-line px-4 py-3 text-sm outline-none transition focus:border-clinic-teal focus:ring-4 focus:ring-clinic-soft"
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-clinic-ink">{label}</span>
      <input
        value={value || ""}
        min={0}
        type="number"
        inputMode="numeric"
        onChange={(event) => onChange(Number(event.target.value || 0))}
        className="mt-2 w-full rounded-2xl border border-clinic-line px-4 py-3 text-sm outline-none transition focus:border-clinic-teal focus:ring-4 focus:ring-clinic-soft"
      />
    </label>
  );
}

function LinesField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-clinic-ink">{label}</span>
      <textarea
        value={value.join("\n")}
        rows={8}
        onChange={(event) => onChange(event.target.value.split("\n").map((line) => line.trim()).filter(Boolean))}
        className="mt-2 w-full resize-y rounded-2xl border border-clinic-line px-4 py-3 text-sm leading-6 outline-none transition focus:border-clinic-teal focus:ring-4 focus:ring-clinic-soft"
      />
    </label>
  );
}

function LongTextField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-clinic-ink">{label}</span>
      <textarea
        value={value}
        rows={5}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-y rounded-2xl border border-clinic-line px-4 py-3 text-sm leading-6 outline-none transition focus:border-clinic-teal focus:ring-4 focus:ring-clinic-soft"
      />
    </label>
  );
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
