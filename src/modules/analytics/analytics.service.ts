import { prisma } from "../../lib/prisma";
import type {
  AdminAnalyticsResult,
  AnalyticsPeriod,
  AnalyticsQuery,
  BestSellingProductItem,
  CategorySalesItem,
  ExpiringWarrantyItem,
  LowStockProductItem,
  SalesTrendItem,
  TopSellerItem,
} from "./analytics.type";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDayFirstDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "—";
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function getPeriodStartDate(period: string, now: Date): Date | null {
  const p = (period || "MONTH").toUpperCase();
  const start = new Date(now);

  if (p === "YEAR") {
    start.setFullYear(now.getFullYear(), 0, 1);
    start.setHours(0, 0, 0, 0);
    return start;
  }
  if (p === "QUARTER") {
    const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
    start.setMonth(quarterStartMonth, 1);
    start.setHours(0, 0, 0, 0);
    return start;
  }
  if (p === "ALL") {
    return null;
  }
  // Default: MONTH (start of current month)
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
}

interface TrendMonthDef {
  key: string;
  label: string;
  year: number;
  monthIndex: number;
  start: Date;
  end: Date;
}

function getTrendBuckets(period: string, now: Date): TrendMonthDef[] {
  const p = (period || "MONTH").toUpperCase();
  const buckets: TrendMonthDef[] = [];

  if (p === "YEAR") {
    // 12 months of current year
    const currentYear = now.getFullYear();
    for (let m = 0; m < 12; m++) {
      const start = new Date(currentYear, m, 1, 0, 0, 0, 0);
      const end = new Date(currentYear, m + 1, 0, 23, 59, 59, 999);
      buckets.push({
        key: `${currentYear}-${String(m + 1).padStart(2, "0")}`,
        label: MONTH_NAMES[m],
        year: currentYear,
        monthIndex: m,
        start,
        end,
      });
    }
    return buckets;
  }

  if (p === "QUARTER") {
    const currentYear = now.getFullYear();
    const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
    for (let i = 0; i < 3; i++) {
      const m = quarterStartMonth + i;
      const start = new Date(currentYear, m, 1, 0, 0, 0, 0);
      const end = new Date(currentYear, m + 1, 0, 23, 59, 59, 999);
      buckets.push({
        key: `${currentYear}-${String(m + 1).padStart(2, "0")}`,
        label: MONTH_NAMES[m],
        year: currentYear,
        monthIndex: m,
        start,
        end,
      });
    }
    return buckets;
  }

  // Default: Last 6 months up to current month for a rich trend line
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const start = new Date(y, m, 1, 0, 0, 0, 0);
    const end = new Date(y, m + 1, 0, 23, 59, 59, 999);
    buckets.push({
      key: `${y}-${String(m + 1).padStart(2, "0")}`,
      label: MONTH_NAMES[m],
      year: y,
      monthIndex: m,
      start,
      end,
    });
  }

  return buckets;
}

export const analyticsService = {
  async getAdminAnalytics(query: AnalyticsQuery): Promise<AdminAnalyticsResult> {
    const now = new Date();
    const period = (query.period || "MONTH").toUpperCase() as AnalyticsPeriod;
    const periodStartDate = getPeriodStartDate(period, now);
    const trendBuckets = getTrendBuckets(period, now);
    const trendEarliestStart = trendBuckets[0]?.start ?? (periodStartDate || new Date(0));

    // 1️⃣ Overview Aggregations
    const [
      onlineRevenueAgg,
      offlineRevenueAgg,
      totalOrdersCount,
      totalOfflineSalesCount,
      totalProductsCount,
      activeWarrantiesCount,
      pendingClaimsCount,
      activeSellersCount,
      lowStockVariantsCount,
    ] = await Promise.all([
      prisma.onlineOrder.aggregate({
        where: {
          status: { notIn: ["CANCELLED", "RETURNED"] },
          ...(periodStartDate ? { createdAt: { gte: periodStartDate } } : {}),
        },
        _sum: { total: true },
      }),
      prisma.offlineSale.aggregate({
        where: {
          ...(periodStartDate ? { saleDate: { gte: periodStartDate } } : {}),
        },
        _sum: { total: true },
      }),
      prisma.onlineOrder.count({
        where: {
          status: { notIn: ["CANCELLED", "RETURNED"] },
          ...(periodStartDate ? { createdAt: { gte: periodStartDate } } : {}),
        },
      }),
      prisma.offlineSale.count({
        where: {
          ...(periodStartDate ? { saleDate: { gte: periodStartDate } } : {}),
        },
      }),
      prisma.product.count({
        where: { deletedAt: null },
      }),
      prisma.warranty.count({
        where: { status: "ACTIVE" },
      }),
      prisma.warrantyClaim.count({
        where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
      }),
      prisma.seller.count({
        where: { status: "APPROVED" },
      }),
      prisma.productVariant.count({
        where: {
          deletedAt: null,
          isActive: true,
          stockQuantity: { lte: 5 },
        },
      }),
    ]);

    const onlineRevenue = Number(onlineRevenueAgg._sum.total || 0);
    const offlineRevenue = Number(offlineRevenueAgg._sum.total || 0);
    const totalRevenue = onlineRevenue + offlineRevenue;
    const totalOrders = totalOrdersCount + totalOfflineSalesCount;

    // 2️⃣ Sales Trend Aggregation
    const [trendOnlineOrders, trendOfflineSales] = await Promise.all([
      prisma.onlineOrder.findMany({
        where: {
          status: { notIn: ["CANCELLED", "RETURNED"] },
          createdAt: { gte: trendEarliestStart },
        },
        select: {
          total: true,
          createdAt: true,
        },
      }),
      prisma.offlineSale.findMany({
        where: {
          saleDate: { gte: trendEarliestStart },
        },
        select: {
          total: true,
          saleDate: true,
        },
      }),
    ]);

    const salesTrend: SalesTrendItem[] = trendBuckets.map((bucket) => {
      let onlineSum = 0;
      let offlineSum = 0;

      for (const order of trendOnlineOrders) {
        const orderTime = new Date(order.createdAt).getTime();
        if (orderTime >= bucket.start.getTime() && orderTime <= bucket.end.getTime()) {
          onlineSum += Number(order.total || 0);
        }
      }

      for (const sale of trendOfflineSales) {
        const saleTime = new Date(sale.saleDate).getTime();
        if (saleTime >= bucket.start.getTime() && saleTime <= bucket.end.getTime()) {
          offlineSum += Number(sale.total || 0);
        }
      }

      return {
        month: bucket.label,
        online: Math.round(onlineSum),
        offline: Math.round(offlineSum),
      };
    });

    // 3️⃣ Category Sales & Best Selling Products Aggregation
    const [onlineOrderItems, offlineSalesItems] = await Promise.all([
      prisma.onlineOrderItem.findMany({
        where: {
          order: {
            status: { notIn: ["CANCELLED", "RETURNED"] },
            ...(periodStartDate ? { createdAt: { gte: periodStartDate } } : {}),
          },
        },
        select: {
          total: true,
          productItem: {
            select: {
              variant: {
                select: {
                  productId: true,
                  product: {
                    select: {
                      id: true,
                      name: true,
                      category: {
                        select: { name: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.offlineSale.findMany({
        where: {
          ...(periodStartDate ? { saleDate: { gte: periodStartDate } } : {}),
        },
        select: {
          total: true,
          productItem: {
            select: {
              variant: {
                select: {
                  productId: true,
                  product: {
                    select: {
                      id: true,
                      name: true,
                      category: {
                        select: { name: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    const categoryCounts = new Map<string, number>();
    const productStats = new Map<
      string,
      { id: string; name: string; category: string; sold: number; revenue: number }
    >();

    const processItem = (
      productInfo: {
        id: string;
        name: string;
        category?: { name: string } | null;
      } | null | undefined,
      totalAmount: number,
    ) => {
      if (!productInfo) return;
      const categoryName = productInfo.category?.name || "General";
      categoryCounts.set(categoryName, (categoryCounts.get(categoryName) || 0) + 1);

      const existingProd = productStats.get(productInfo.id);
      if (existingProd) {
        existingProd.sold += 1;
        existingProd.revenue += totalAmount;
      } else {
        productStats.set(productInfo.id, {
          id: productInfo.id,
          name: productInfo.name,
          category: categoryName,
          sold: 1,
          revenue: totalAmount,
        });
      }
    };

    for (const item of onlineOrderItems) {
      processItem(item.productItem?.variant?.product, Number(item.total || 0));
    }
    for (const sale of offlineSalesItems) {
      processItem(sale.productItem?.variant?.product, Number(sale.total || 0));
    }

    // Ensure all active top categories are listed even if 0 sales
    if (categoryCounts.size < 5) {
      const existingCategories = await prisma.category.findMany({
        where: { isActive: true },
        select: { name: true },
        take: 8,
      });
      for (const cat of existingCategories) {
        if (!categoryCounts.has(cat.name)) {
          categoryCounts.set(cat.name, 0);
        }
      }
    }

    const categorySales: CategorySalesItem[] = Array.from(categoryCounts.entries())
      .map(([category, sales]) => ({ category, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 8);

    const bestSellingProducts: BestSellingProductItem[] = Array.from(productStats.values())
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    // 4️⃣ Top Sellers Aggregation
    const rawTopSellers = await prisma.offlineSale.findMany({
      where: {
        ...(periodStartDate ? { saleDate: { gte: periodStartDate } } : {}),
      },
      select: {
        sellerId: true,
        total: true,
        seller: {
          select: {
            id: true,
            companyName: true,
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    const sellerMap = new Map<string, { name: string; sales: number; revenue: number }>();
    for (const sale of rawTopSellers) {
      const sellerId = sale.sellerId;
      const sellerName = sale.seller?.companyName || sale.seller?.user?.name || "Merchant";
      const saleAmount = Number(sale.total || 0);

      const existing = sellerMap.get(sellerId);
      if (existing) {
        existing.sales += 1;
        existing.revenue += saleAmount;
      } else {
        sellerMap.set(sellerId, {
          name: sellerName,
          sales: 1,
          revenue: saleAmount,
        });
      }
    }

    const topSellers: TopSellerItem[] = Array.from(sellerMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // 5️⃣ Low Stock Products Query
    const lowStockVariants = await prisma.productVariant.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        stockQuantity: { lte: 10 },
      },
      select: {
        id: true,
        stockQuantity: true,
        lowStockThreshold: true,
        attributes: true,
        product: {
          select: {
            id: true,
            name: true,
            category: { select: { name: true } },
          },
        },
      },
      orderBy: { stockQuantity: "asc" },
      take: 15,
    });

    const lowStockProducts: LowStockProductItem[] = lowStockVariants
      .filter((v) => v.stockQuantity <= (v.lowStockThreshold || 5))
      .slice(0, 10)
      .map((v) => {
        const status =
          v.stockQuantity <= 0
            ? "OUT_OF_STOCK"
            : v.stockQuantity <= 2
            ? "CRITICAL"
            : "LOW";

        return {
          id: v.id,
          name: v.product?.name || "Product Variant",
          category: v.product?.category?.name || "General",
          stock: v.stockQuantity,
          status,
        };
      });

    // 6️⃣ Warranties Expiring Soon (Next 30 Days)
    const next30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const rawExpiringWarranties = await prisma.warranty.findMany({
      where: {
        status: "ACTIVE",
        endDate: {
          gte: now,
          lte: next30Days,
        },
      },
      select: {
        id: true,
        endDate: true,
        productItem: {
          select: {
            serialNumber: true,
            variant: {
              select: {
                product: {
                  select: { name: true },
                },
              },
            },
          },
        },
        customer: {
          select: {
            user: {
              select: { name: true },
            },
          },
        },
        seller: {
          select: {
            companyName: true,
          },
        },
      },
      orderBy: { endDate: "asc" },
      take: 10,
    });

    const expiringWarranties: ExpiringWarrantyItem[] = rawExpiringWarranties.map((w) => {
      const daysRemaining = Math.max(
        0,
        Math.ceil((new Date(w.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      );

      return {
        id: w.id,
        uniqueId: w.productItem?.serialNumber || "—",
        product: w.productItem?.variant?.product?.name || "Protected Product",
        customer: w.customer?.user?.name || w.seller?.companyName || "Registered Customer",
        expiryDate: formatDayFirstDate(w.endDate),
        daysRemaining,
      };
    });

    return {
      overview: {
        totalRevenue: Math.round(totalRevenue),
        onlineRevenue: Math.round(onlineRevenue),
        offlineRevenue: Math.round(offlineRevenue),
        totalOrders,
        totalProducts: totalProductsCount,
        lowStockCount: lowStockVariantsCount,
        activeWarranties: activeWarrantiesCount,
        pendingClaims: pendingClaimsCount,
        activeSellers: activeSellersCount,
      },
      salesTrend,
      categorySales,
      topSellers,
      bestSellingProducts,
      lowStockProducts,
      expiringWarranties,
    };
  },
};

