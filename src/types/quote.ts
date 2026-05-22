export type ServiceTemplate = {
  id: string;
  name: string;
  category: string;
  regularPrice: number;
  packageType: string;
  inclusions: string[];
  conditionalItems: string[];
  standardNotes: string[];
  disclaimer: string;
  paymentMethodNotes: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type QuoteDraft = {
  patientName: string;
  preparedBy: string;
  discountAmount: number;
  discountLabel: string;
  downPayment: number;
  quoteValidity: string;
  serviceScope: string;
  customNotes: string;
};

export type SavedQuote = QuoteDraft & {
  id: string;
  serviceId: string;
  createdAt: string;
  finalPackagePrice: number;
  remainingBalance: number;
};
