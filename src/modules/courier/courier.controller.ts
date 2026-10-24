import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { prisma } from "../../lib/prisma";
import { orderService } from "../order/order.service";

/**
 * Handle Webhook from Steadfast Courier
 * Payload example: { consignment_id, invoice, status: "delivered" | "cancelled" | "partial_delivered", tracking_code }
 */
const handleSteadfastWebhook = catchAsync(async (req: Request, res: Response) => {
  const { consignment_id, invoice, status, tracking_code } = req.body;

  const order = await prisma.onlineOrder.findFirst({
    where: {
      OR: [
        ...(invoice ? [{ orderNumber: invoice }] : []),
        ...(tracking_code ? [{ trackingNumber: tracking_code }] : []),
        ...(consignment_id ? [{ consignmentId: String(consignment_id) }] : []),
      ],
    },
  });

  if (!order) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Order matching courier tracking not found",
      data: null,
    });
  }

  const courierStatus = String(status).toLowerCase();

  if (courierStatus === "delivered" && order.status !== "DELIVERED") {
    await orderService.updateStatus(order.id, {
      status: "DELIVERED",
      courierStatus: "delivered",
    });
  } else if (
    (courierStatus === "cancelled" || courierStatus === "returned") &&
    order.status !== "RETURNED" &&
    order.status !== "CANCELLED"
  ) {
    await orderService.updateStatus(order.id, {
      status: "RETURNED",
      reason: "Returned via courier webhook",
      courierStatus,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Steadfast webhook processed successfully",
    data: null,
  });
});

/**
 * Handle Webhook from Pathao Courier
 */
const handlePathaoWebhook = catchAsync(async (req: Request, res: Response) => {
  const { consignment_id, merchant_order_id, order_status } = req.body;

  const order = await prisma.onlineOrder.findFirst({
    where: {
      OR: [
        ...(merchant_order_id ? [{ orderNumber: merchant_order_id }] : []),
        ...(consignment_id ? [{ consignmentId: String(consignment_id) }] : []),
      ],
    },
  });

  if (!order) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Order matching courier tracking not found",
      data: null,
    });
  }

  const statusStr = String(order_status).toLowerCase();

  if (statusStr.includes("delivered") && order.status !== "DELIVERED") {
    await orderService.updateStatus(order.id, {
      status: "DELIVERED",
      courierStatus: "delivered",
    });
  } else if (
    (statusStr.includes("return") || statusStr.includes("cancel")) &&
    order.status !== "RETURNED" &&
    order.status !== "CANCELLED"
  ) {
    await orderService.updateStatus(order.id, {
      status: "RETURNED",
      reason: "Returned via Pathao webhook",
      courierStatus: statusStr,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pathao webhook processed successfully",
    data: null,
  });
});

export const courierController = {
  handleSteadfastWebhook,
  handlePathaoWebhook,
};
