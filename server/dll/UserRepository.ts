import type { ExtractUpdateData } from "../types/prisma";
import prisma from "../utils/prisma";

type UpdateUserData = ExtractUpdateData<typeof prisma.user>;

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { profilePicture: { select: { url: true } } },
    });
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
          connect: { id: data.profilePictureId },
        },
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profilePicture: { select: { url: true } } },
    });
  }

  async update(id: string, data: UpdateUserData) {
    return prisma.user.update({ where: { id }, data: data });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }

  async findRelatedUsers(id: string) {
    const users = await prisma.user.findMany({
      where: {
        chats: {
          some: {
            chat: {
              participants: {
                some: {
                  userId: id,
                },
              },
            },
          },
        },
        NOT: { id: id },
      },
      select: {
        id: true,
      },
    });

    const chattedUserIds = users.map((u) => u.id);

    return chattedUserIds;
  }

  async findUsersWithoutChat(currentUserId: string, searchQuery: string) {
    const chattedUserIds = await this.findRelatedUsers(currentUserId);

    return prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { userName: { contains: searchQuery } },
              { email: { contains: searchQuery } },
            ],
          },
          {
            id: {
              notIn: [...chattedUserIds, currentUserId],
            },
          },
        ],
      },
      select: {
        id: true,
        userName: true,
        email: true,
        bio: true,
        profilePicture: {
          select: {
            url: true,
          },
        },
        isOnline: true,
        lastSeen: true,
      },
      take: 10,
    });
  }
}

export const userRepository = new UserRepository();
