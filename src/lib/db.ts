import type { SavedQuote } from "@/types/quote";

const quoteStore: SavedQuote[] = [];

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
  return [...quoteStore];
}
