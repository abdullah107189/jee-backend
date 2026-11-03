export interface SystemSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  codEnabled: boolean;
  defaultWarrantyMonths: number;
  warrantyTerms: string;
  auditLoggingEnabled: boolean;
  featuredProductIds?: string[];
  updatedAt: string;
}

export type UpdateSystemSettingsInput = Partial<Omit<SystemSettings, "updatedAt">>;

