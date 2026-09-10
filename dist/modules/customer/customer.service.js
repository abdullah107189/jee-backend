import { AppError } from "../../middleware/error.middleware";
import { hashPassword } from "../../utils/password";
import { CUSTOMER_MESSAGES } from "./customer.constant";
import { customerRepository } from "./customer.repository";
export const customerService = {
    async list(query) {
        const params = { search: query.search, skip: query.skip, take: query.take };
        const [customers, total] = await Promise.all([customerRepository.findMany(params), customerRepository.count(params)]);
        return { customers, total };
    },
    async getById(id) {
        const customer = await customerRepository.findById(id);
        if (!customer)
            throw new AppError(CUSTOMER_MESSAGES.NOT_FOUND, 404);
        return customer;
    },
    async getByUserId(userId) {
        const customer = await customerRepository.findByUserId(userId);
        if (!customer)
            throw new AppError(CUSTOMER_MESSAGES.NOT_FOUND, 404);
        return customer;
    },
    async create(input) {
        const email = input.email.trim().toLowerCase();
        const existing = await customerRepository.findUserByEmail(email);
        if (existing)
            throw new AppError(CUSTOMER_MESSAGES.EMAIL_IN_USE, 409);
        return customerRepository.create({
            email,
            password: hashPassword(input.password),
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            phone: input.phone?.trim(),
            shippingAddress: input.shippingAddress,
            billingAddress: input.billingAddress,
            preferredPayment: input.preferredPayment,
        });
    },
    async update(id, input) {
        await this.getById(id);
        return customerRepository.update(id, input);
    },
    async updateMe(userId, input) {
        const customer = await this.getByUserId(userId);
        return customerRepository.update(customer.id, input);
    },
    async remove(id) {
        const customer = await this.getById(id);
        await customerRepository.remove(id, customer.userId);
    },
};
//# sourceMappingURL=customer.service.js.map