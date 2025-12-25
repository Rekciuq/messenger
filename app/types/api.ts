import type { ErrorCode } from '~/constants/error/codes'

export interface ApiResponse<T = unknown> {
    success: boolean
    message: string
    data?: T
    error?: {
        code: ErrorCode
        details?: unknown
    }
}

