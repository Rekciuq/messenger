import z from "zod";
import { 
    FILE_REQUIRED_MESSAGE,
    FILE_INVALID_TYPE_MESSAGE,
    FILE_TOO_LARGE_MESSAGE
} from "~/constants/validation/auth/messages"

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const fileSchema = z.instanceof(File, { message: FILE_REQUIRED_MESSAGE })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: FILE_TOO_LARGE_MESSAGE,
    })
    .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
        message: FILE_INVALID_TYPE_MESSAGE,
    });

export default fileSchema;