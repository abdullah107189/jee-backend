import { Router } from "express";
import activityLogRoutes from "../modules/activity-log/activity-log.route";
import adminRoutes from "../modules/admin/admin.route";
import auditLogRoutes from "../modules/audit-log/audit-log.route";
import authRoutes from "../modules/auth/auth.route";
import brandRoutes from "../modules/brand/brand.route";
import categoryRoutes from "../modules/category/category.route";
import customerRoutes from "../modules/customer/customer.route";
import notificationRoutes from "../modules/notification/notification.route";
import offlineSaleRoutes from "../modules/offline-sale/offline-sale.route";
import orderRoutes from "../modules/order/order.route";
import paymentRoutes from "../modules/payment/payment.route";
import productRoutes from "../modules/product/product.route";
import sellerRoutes from "../modules/seller/seller.route";
import userRoutes from "../modules/user/user.route";
import warrantyClaimRoutes from "../modules/warranty-claim/warranty-claim.route";
import warrantyRoutes from "../modules/warranty/warranty.route";

const router = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoutes },
  { path: "/users", route: userRoutes },
  { path: "/admins", route: adminRoutes },
  { path: "/sellers", route: sellerRoutes },
  { path: "/customers", route: customerRoutes },
  { path: "/categories", route: categoryRoutes },
  { path: "/brands", route: brandRoutes },
  { path: "/products", route: productRoutes },
  { path: "/orders", route: orderRoutes },
  { path: "/offline-sales", route: offlineSaleRoutes },
  { path: "/warranties", route: warrantyRoutes },
  { path: "/warranty-claims", route: warrantyClaimRoutes },
  { path: "/payments", route: paymentRoutes },
  { path: "/notifications", route: notificationRoutes },
  { path: "/audit-logs", route: auditLogRoutes },
  { path: "/activity-logs", route: activityLogRoutes },
];

moduleRoutes.forEach((moduleRoute) => router.use(moduleRoute.path, moduleRoute.route));

export default router;