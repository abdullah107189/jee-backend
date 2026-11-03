import type { SystemSettings } from "./setting.type";

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  storeName: "JEE Bangladesh",
  supportEmail: "support@JEE.bd",
  supportPhone: "+880 1700-000000",
  currency: "BDT (৳)",
  codEnabled: true,
  defaultWarrantyMonths: 12,
  warrantyTerms:
    "Covers manufacturing defects for motor and mainboard components. Physical, liquid or accidental damage voids warranty automatically.",
  auditLoggingEnabled: true,
  updatedAt: new Date().toISOString(),
};

export const SETTING_MESSAGES = {
  FETCH_SUCCESS: "System configuration retrieved successfully",
  UPDATE_SUCCESS: "System configuration updated successfully",
  BACKUP_SUCCESS: "Database snapshot generated successfully",
};

