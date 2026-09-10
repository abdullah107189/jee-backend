import { AppError } from "../../middleware/error.middleware";
import { hashPassword } from "../../utils/password";
import { SELLER_MESSAGES } from "./seller.constant";
import { sellerRepository } from "./seller.repository";
export const sellerService = {
    async list(query) {
        const params = { search: query.search, status: query.status, skip: query.skip, take: query.take };
        const [sellers, total] = await Promise.all([sellerRepository.findMany(params), sellerRepository.count(params)]);
        return { sellers, total };
    },
    async getById(id) {
        const seller = await sellerRepository.findById(id);
        if (!seller)
            throw new AppError(SELLER_MESSAGES.NOT_FOUND, 404);
        return seller;
    },
    async getByUserId(userId) {
        const seller = await sellerRepository.findByUserId(userId);
        if (!seller)
            throw new AppError(SELLER_MESSAGES.NOT_FOUND, 404);
        return seller;
    },
    async create(input) {
        const email = input.email.trim().toLowerCase();
        const existing = await sellerRepository.findUserByEmail(email);
        if (existing)
            throw new AppError(SELLER_MESSAGES.EMAIL_IN_USE, 409);
        return sellerRepository.create({
            email,
            password: hashPassword(input.password),
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            phone: input.phone?.trim(),
            companyName: input.companyName.trim(),
            businessLicense: input.businessLicense?.trim(),
            address: input.address?.trim(),
            city: input.city?.trim(),
            state: input.state?.trim(),
            zipCode: input.zipCode?.trim(),
            country: input.country.trim(),
            taxId: input.taxId?.trim(),
        });
    },
    async update(id, input) {
        await this.getById(id);
        return sellerRepository.update(id, input);
    },
    async updateMe(userId, input) {
        const seller = await this.getByUserId(userId);
        return sellerRepository.update(seller.id, input);
    },
    async remove(id) {
        const seller = await this.getById(id);
        await sellerRepository.remove(id, seller.userId);
    },
};
//# sourceMappingURL=seller.service.js.map