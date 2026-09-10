import type { Prisma } from "../../../prisma/generated/prisma/client";
import type { CreateCustomerInput, CustomerProfile, CustomerQuery, ListCustomersResult } from "./customer.type";
export declare const customerService: {
    list(query: CustomerQuery): Promise<ListCustomersResult>;
    getById(id: string): Promise<CustomerProfile>;
    getByUserId(userId: string): Promise<CustomerProfile>;
    create(input: CreateCustomerInput): Promise<CustomerProfile>;
    update(id: string, input: Prisma.CustomerUpdateInput): Promise<CustomerProfile>;
    updateMe(userId: string, input: Prisma.CustomerUpdateInput): Promise<CustomerProfile>;
    remove(id: string): Promise<void>;
};
