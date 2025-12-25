import { ErrorCode } from "./codes";

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
    [ErrorCode.VALIDATION_ERROR]: "Input validation failed",
    [ErrorCode.INTERNAL_SERVER_ERROR]: "An unexpected error occurred",
    [ErrorCode.UNAUTHORIZED]: "You are not authorized to perform this action",
    [ErrorCode.FORBIDDEN]: "Access forbidden",
    [ErrorCode.NOT_FOUND]: "Resource not found",
    [ErrorCode.ALREADY_EXISTS]: "Resource already exists",
};

