import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { FileFormat } from '../types/file';
import { UPLOAD_DIRS } from '../constants/file';

export async function convertToWebP(buffer: Buffer | ArrayBuffer): Promise<Buffer> {
    const inputBuffer = buffer instanceof ArrayBuffer ? Buffer.from(buffer) : buffer;
    const quality = 80;
    return await sharp(inputBuffer)
        .webp({ quality })
        .toBuffer();
}

export async function saveFile(
    file: File, 
    format: FileFormat = FileFormat.IMAGE, 
    convertWebP: boolean = true
) {
    const id = crypto.randomUUID();
    const subDir = UPLOAD_DIRS[format];
    const uploadDir = path.join(process.cwd(), 'public', subDir);
    
    await fs.mkdir(uploadDir, { recursive: true });

    let finalFileName: string;
    let finalBuffer: Buffer;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (convertWebP && format === FileFormat.IMAGE && file.type.startsWith('image/')) {
        finalFileName = `${id}.webp`;
        finalBuffer = await convertToWebP(buffer);
    } else {
        const fileExtension = path.extname(file.name);
        finalFileName = `${id}${fileExtension}`;
        finalBuffer = buffer;
    }

    const filePath = path.join(uploadDir, finalFileName);
    await fs.writeFile(filePath, finalBuffer);

    return {
        url: `/${subDir}/${finalFileName}`,
        id
    };
}

export function getFilePath(id: string, format: FileFormat, extension: string = 'webp'): string {
    const subDir = UPLOAD_DIRS[format];
    const fileName = format === FileFormat.IMAGE ? `${id}.${extension}` : `${id}${extension}`;
    return path.join(process.cwd(), 'public', subDir, fileName);
}

export async function deleteFile(id: string, format: FileFormat, extension: string = 'webp'): Promise<void> {
    const filePath = getFilePath(id, format, extension);
    try {
        await fs.unlink(filePath);
    } catch (error) {
        console.error(`Failed to delete file at ${filePath}:`, error);
    }
}
