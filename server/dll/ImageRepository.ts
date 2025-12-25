import type { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";
import { FileFormat } from "../types/file";
import fs from 'fs/promises';

export class ImageRepository {
    async createImage(data: {
        image: File;
    }) {
        const { url: profilePictureUrl, id: profilePictureId } = await saveFile(
            data.image,
            FileFormat.IMAGE
        );

        await prisma.image.create({
            data: {
                id: profilePictureId,
                url: profilePictureUrl
            }
        });
        return {
            imageId: profilePictureId,
            imageUrl: profilePictureUrl
        }
    }

    async findById(id: string) {
        return prisma.image.findUnique({ where: { id } });
    }

    async deleteById(id: string) {
        const image = await prisma.image.findUnique({ where: { id } });
        if (image) {
            await fs.unlink(getFilePath(image.id, FileFormat.IMAGE));
        }
        return prisma.image.delete({ where: { id } });
    }

    async update(id: string, data: Prisma.ImageUpdateInput) {
        return prisma.image.update({ where: { id }, data });
    }
}

export const imageRepository = new ImageRepository();
