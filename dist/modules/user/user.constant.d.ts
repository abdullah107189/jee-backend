import type { UserRole } from "../../../prisma/generated/prisma/client";
export declare const USER_ROLES: readonly UserRole[];
export declare const USER: {
    readonly DEFAULT_PAGE_SIZE: 20;
    readonly MAX_PAGE_SIZE: 100;
};
export declare const USER_MESSAGES: {
    readonly NOT_FOUND: "User not found";
    readonly EMAIL_IN_USE: "Email is already in use";
    readonly PHONE_IN_USE: "Phone number is already in use";
    readonly CREATED: "User created successfully";
    readonly UPDATED: "User updated successfully";
    readonly DELETED: "User removed successfully";
    readonly PROFILE_UPDATED: "Profile updated successfully";
};
