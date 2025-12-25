import type { z } from "zod";
import type { H3Event } from "h3";
import { ErrorCode } from "../../app/constants/error/codes";
import { ERROR_MESSAGES } from "../../app/constants/error/messages";

export async function validateBody<T extends z.ZodTypeAny>(event: H3Event, schema: T) {
    const body = await readBody(event);
    const result = await schema.safeParseAsync(body);
    
    if (!result.success) {
        return {
            error: {
                code: ErrorCode.VALIDATION_ERROR,
                message: ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR],
                details: result.error.flatten()
            }
        };
    }
    
    return { data: result.data as z.infer<T> };
}

export async function validateMultipart<T extends z.ZodTypeAny>(event: H3Event, schema: T) {
    const formData = await readMultipartFormData(event);
    
    if (!formData) {
        return {
            error: {
                code: ErrorCode.VALIDATION_ERROR,
                message: ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR],
                details: "No form data provided"
            }
        };
    }

    const body: Record<string, string | File> = {};
    
    for (const field of formData) {
        if (!field.name) continue;

        if (field.filename) {
            body[field.name] = new File([new Uint8Array(field.data)], field.filename, { type: field.type });
        } else {
            body[field.name] = field.data.toString();
        }
    }

    const result = await schema.safeParseAsync(body);
    
    if (!result.success) {
        return {
            error: {
                code: ErrorCode.VALIDATION_ERROR,
                message: ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR],
                details: result.error.flatten()
            }
        };
    }
    
    return { data: result.data as z.infer<T> };
}

export async function validateQuery<T extends z.ZodTypeAny>(event: H3Event, schema: T) {
    const query = getQuery(event);
    const result = await schema.safeParseAsync(query);
    
    if (!result.success) {
        return {
            error: {
                code: ErrorCode.VALIDATION_ERROR,
                message: ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR],
                details: result.error.flatten()
            }
        };
    }
    
    return { data: result.data as z.infer<T> };
}
