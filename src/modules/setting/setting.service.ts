import fs from "fs";
import path from "path";
import type { Prisma } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { DEFAULT_SYSTEM_SETTINGS } from "./setting.constant";
import type { SystemSettings, UpdateSystemSettingsInput } from "./setting.type";
import AppError from "../../errors/AppError";

const SETTINGS_FILE_PATH = path.resolve(process.cwd(), "storage", "system-settings.json");

function ensureStorageDir() {
  const dir = path.dirname(SETTINGS_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export const settingService = {
  getSettings(): SystemSettings {
    try {
      ensureStorageDir();
      if (fs.existsSync(SETTINGS_FILE_PATH)) {
        const raw = fs.readFileSync(SETTINGS_FILE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_SYSTEM_SETTINGS,
          ...parsed,
        };
      }
    } catch (err) {
      console.error("[settingService.getSettings] Failed to read settings file:", err);
    }
    return DEFAULT_SYSTEM_SETTINGS;
  },

  async updateSettings(
    input: UpdateSystemSettingsInput,
    userId?: string,
  ): Promise<SystemSettings> {
    if (input.featuredProductIds !== undefined) {
      if (!Array.isArray(input.featuredProductIds)) {
        throw new AppError("featuredProductIds must be an array of product IDs", 400);
      }
      if (input.featuredProductIds.length > 8) {
        throw new AppError("Maximum 8 featured products allowed", 400);
      }
    }

    const current = this.getSettings();
    const updated: SystemSettings = {
      ...current,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    try {
      ensureStorageDir();
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
    } catch (err) {
      console.error("[settingService.updateSettings] Failed to persist settings file:", err);
    }

    if (userId) {
      try {
        await prisma.auditLog.create({
          data: {
            userId,
            action: "SYSTEM_SETTINGS_UPDATED",
            entity: "SystemSettings",
            entityId: "GLOBAL_SETTINGS",
            changes: {
              previous: current,
              updated,
            } as unknown as Prisma.InputJsonValue,
            severity: "INFO",
          },
        });
      } catch (auditErr) {
        console.error("[settingService.updateSettings] Audit log creation failed:", auditErr);
      }
    }

    return updated;
  },

  async generateDatabaseBackup(): Promise<Record<string, unknown>> {
    const [
      categories,
      brands,
      products,
      orders,
      offlineSales,
      warranties,
      sellers,
      customers,
    ] = await Promise.all([
      prisma.category.findMany({ where: { deletedAt: null } }),
      prisma.brand.findMany({ where: { deletedAt: null } }),
      prisma.product.findMany({
        where: { deletedAt: null },
        include: {
          variants: {
            where: { deletedAt: null },
            include: { productItems: true },
          },
        },
      }),
      prisma.onlineOrder.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
        include: { orderItems: true },
      }),
      prisma.offlineSale.findMany({
        take: 100,
        orderBy: { saleDate: "desc" },
      }),
      prisma.warranty.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
      }),
      prisma.seller.findMany({
        where: { deletedAt: null },
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      }),
      prisma.customer.findMany({
        where: { deletedAt: null },
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      }),
    ]);

    return {
      version: "1.0",
      timestamp: new Date().toISOString(),
      generator: "JEE Bangladesh Admin Engine",
      summary: {
        categoriesCount: categories.length,
        brandsCount: brands.length,
        productsCount: products.length,
        ordersCount: orders.length,
        offlineSalesCount: offlineSales.length,
        warrantiesCount: warranties.length,
        sellersCount: sellers.length,
        customersCount: customers.length,
      },
      data: {
        categories,
        brands,
        products,
        orders,
        offlineSales,
        warranties,
        sellers,
        customers,
      },
    };
  },
};
