import { type ValidationResult } from "../../utils/validation";
import type { CreateOrderInput, OrderStatusInput } from "./order.type";
export declare function validateCreateOrderInput(data: unknown): ValidationResult<CreateOrderInput>;
export declare function validateOrderStatusInput(data: unknown): ValidationResult<OrderStatusInput>;
