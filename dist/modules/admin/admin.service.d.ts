import type { AdminProfile, AdminQuery, CreateAdminInput, ListAdminsResult, UpdateAdminInput } from "./admin.type";
export declare const adminService: {
    list(query: AdminQuery): Promise<ListAdminsResult>;
    getById(id: string): Promise<AdminProfile>;
    create(input: CreateAdminInput): Promise<AdminProfile>;
    update(id: string, input: UpdateAdminInput): Promise<AdminProfile>;
    remove(id: string): Promise<void>;
};
