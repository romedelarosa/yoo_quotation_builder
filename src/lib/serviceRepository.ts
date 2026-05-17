import { serviceTemplates } from "@/data/services";
import type { ServiceTemplate } from "@/types/quote";

type ServiceSource = "supabase" | "fallback";

type SupabaseServiceRow = {
  id: string;
  name: string;
  category: string;
  regular_price: number;
  package_type: string;
  inclusions: string[];
  conditional_items: string[];
  standard_notes: string[];
  disclaimer: string;
  payment_method_notes: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

type SupabaseConfig = {
  url: string;
  key: string;
};

const fallbackServices = serviceTemplates.map((service, index) => ({
  ...service,
  isActive: true,
  sortOrder: index
}));

function getSupabaseConfig(): SupabaseConfig | null {
  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.STORAGE_URL ||
    process.env.STORAGE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.STORAGE_SERVICE_ROLE_KEY ||
    process.env.STORAGE_SECRET_KEY ||
    process.env.STORAGE_ANON_KEY ||
    process.env.STORAGE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return null;
  }

  return { url: url.replace(/\/$/, ""), key };
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${detail}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function toServiceTemplate(row: SupabaseServiceRow): ServiceTemplate {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    regularPrice: Number(row.regular_price || 0),
    packageType: row.package_type,
    inclusions: row.inclusions || [],
    conditionalItems: row.conditional_items || [],
    standardNotes: row.standard_notes || [],
    disclaimer: row.disclaimer || "",
    paymentMethodNotes: row.payment_method_notes || "",
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function toSupabaseRow(service: ServiceTemplate, index = 0): SupabaseServiceRow {
  return {
    id: service.id,
    name: service.name,
    category: service.category,
    regular_price: Math.max(0, Math.round(Number(service.regularPrice || 0))),
    package_type: service.packageType,
    inclusions: service.inclusions || [],
    conditional_items: service.conditionalItems || [],
    standard_notes: service.standardNotes || [],
    disclaimer: service.disclaimer || "",
    payment_method_notes: service.paymentMethodNotes || "",
    is_active: service.isActive !== false,
    sort_order: service.sortOrder ?? index
  };
}

function sortServices(services: ServiceTemplate[]): ServiceTemplate[] {
  return [...services].sort((left, right) => {
    const sortDifference = (left.sortOrder ?? 0) - (right.sortOrder ?? 0);
    return sortDifference || left.name.localeCompare(right.name);
  });
}

export async function listServiceTemplates(): Promise<{ services: ServiceTemplate[]; source: ServiceSource }> {
  if (!getSupabaseConfig()) {
    return { services: fallbackServices, source: "fallback" };
  }

  try {
    const rows = await supabaseRequest<SupabaseServiceRow[]>(
      "service_templates?select=*&is_active=eq.true&order=sort_order.asc,name.asc"
    );
    const services = rows.map(toServiceTemplate);

    return {
      services: services.length > 0 ? services : fallbackServices,
      source: services.length > 0 ? "supabase" : "fallback"
    };
  } catch {
    return { services: fallbackServices, source: "fallback" };
  }
}

export async function findServiceTemplateById(serviceId: string): Promise<ServiceTemplate | undefined> {
  const { services } = await listServiceTemplates();
  return services.find((service) => service.id === serviceId);
}

export async function upsertServiceTemplate(service: ServiceTemplate): Promise<ServiceTemplate> {
  if (!getSupabaseConfig()) {
    throw new Error("Supabase environment variables are required to save service templates.");
  }

  const [row] = await supabaseRequest<SupabaseServiceRow[]>("service_templates?on_conflict=id", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify(toSupabaseRow(service))
  });

  return toServiceTemplate(row);
}

export async function archiveServiceTemplate(serviceId: string): Promise<void> {
  if (!getSupabaseConfig()) {
    throw new Error("Supabase environment variables are required to archive service templates.");
  }

  await supabaseRequest(`service_templates?id=eq.${encodeURIComponent(serviceId)}`, {
    method: "PATCH",
    headers: {
      Prefer: "return=minimal"
    },
    body: JSON.stringify({ is_active: false })
  });
}

export async function seedDefaultServiceTemplates(): Promise<ServiceTemplate[]> {
  if (!getSupabaseConfig()) {
    throw new Error("Supabase environment variables are required to seed service templates.");
  }

  const rows = await supabaseRequest<SupabaseServiceRow[]>("service_templates?on_conflict=id", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify(fallbackServices.map(toSupabaseRow))
  });

  return sortServices(rows.map(toServiceTemplate));
}
