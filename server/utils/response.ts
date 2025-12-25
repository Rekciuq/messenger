import type { ApiResponse } from "../../app/types/api"
import { ERROR_MESSAGES } from "../../app/constants/error/messages"
import type { ErrorCode } from "../../app/constants/error/codes"

export function apiSuccess<T>(data: T, message: string = "Success"): ApiResponse<T> {
    return {
        success: true,
        message,
        data,
    };
}

export function apiError(code: ErrorCode, details?: unknown): ApiResponse {
    const message = ERROR_MESSAGES[code] || "An error occurred";
    
    return {
        success: false,
        message,
        error: {
            code,
            details,
        },
    };
}

