import { FileFormat } from '../types/file';

export const UPLOAD_DIRS = {
    [FileFormat.IMAGE]: 'uploads/images',
    [FileFormat.FILE]: 'uploads/files'
} as const;

