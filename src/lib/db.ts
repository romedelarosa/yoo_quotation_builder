import { serviceTemplates } from "@/data/services";
import type { SavedQuote, ServiceTemplate } from "@/types/quote";

const quoteStore: SavedQuote[] = [];

export function getServices(): ServiceTemplate[] {
  return serviceTemplates;
}

export function getServiceById(serviceId: string): ServiceTemplate | undefined {
  return serviceTemplates.find((service) => service.id === serviceId);
}

export function saveQuote(quote: Omit<SavedQuote, "id" | "createdAt">): SavedQuote {
  const savedQuote: SavedQuote = {
    ...quote,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };

  quoteStore.unshift(savedQuote);
  return savedQuote;
}

export function listQuotes(): SavedQuote[] {
  return quoteStore;
}
