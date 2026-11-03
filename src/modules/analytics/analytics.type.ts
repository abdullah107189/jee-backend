export type AnalyticsPeriod = "MONTH" | "QUARTER" | "YEAR" | "ALL";

export interface AnalyticsQuery {
  period?: AnalyticsPeriod | string;
}

export interface SalesTrendItem {
  month: string;
  online: number;
  offline: number;
}

export interface CategorySalesItem {
  category: string;
  sales: number;
}

export interface TopSellerItem {
  name: string;
  sales: number;
  revenue: number;
}

export interface BestSellingProductItem {
  id: string;
  name: string;
  category: string;
  sold: number;
  revenue: number;
}

export interface LowStockProductItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  status: "CRITICAL" | "LOW" | "OUT_OF_STOCK";
}

export interface ExpiringWarrantyItem {
  id: string;
  uniqueId: string;
  product: string;
  customer: string;
  expiryDate: string;
  daysRemaining: number;
}

export interface AnalyticsOverview {
  totalRevenue: number;
  onlineRevenue: number;
  offlineRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
  activeWarranties: number;
  pendingClaims: number;
  activeSellers: number;
}

export interface AdminAnalyticsResult {
  overview: AnalyticsOverview;
  salesTrend: SalesTrendItem[];
  categorySales: CategorySalesItem[];
  topSellers: TopSellerItem[];
  bestSellingProducts: BestSellingProductItem[];
  lowStockProducts: LowStockProductItem[];
  expiringWarranties: ExpiringWarrantyItem[];
}

