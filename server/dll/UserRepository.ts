import type { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

export class UserRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email }, include: { profilePicture: { select: { url: true } } } });
    }

    async createUser(data: {
        email: string;
        userName: string;
        bio?: string;
        password: string;
        profilePictureId: string;
    }) {
        return prisma.user.create({
            data: {
                email: data.email,
                userName: data.userName,
                bio: data.bio,
                password: data.password,
                profilePicture: {
                    connect: { id: data.profilePictureId }
                }
            }
        });
    }

    async findById(id: string) {
        return prisma.user.findUnique({ where: { id } });
    }

    async update(id: string, data: Prisma.UserUpdateInput) {
        return prisma.user.update({ where: { id }, data });
    }

    async delete(id: string) {
        return prisma.user.delete({ where: { id } });
    }
}

export const userRepository = new UserRepository();
