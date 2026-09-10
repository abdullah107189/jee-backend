import { Prisma } from "../../../prisma/generated/prisma/client";
import type { CreateUserInput, ListUsersResult, PublicUser, UpdateUserInput, UserQuery } from "./user.type";
export declare const userService: {
    list(query: UserQuery): Promise<ListUsersResult>;
    getById(id: string): Promise<PublicUser>;
    me(userId: string): Promise<PublicUser>;
    create(input: CreateUserInput): Promise<PublicUser>;
    update(id: string, input: UpdateUserInput): Promise<PublicUser>;
    updateMe(userId: string, input: Prisma.UserUpdateInput): Promise<PublicUser>;
    remove(id: string): Promise<void>;
};
