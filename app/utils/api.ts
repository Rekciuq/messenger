import { toast } from 'vue-sonner'
import type { ApiResponse } from '~/types/api'

interface ApiError {
    data?: ApiResponse
    statusMessage?: string
}

type ApiFetchOptions<T> = Parameters<typeof $fetch<ApiResponse<T>>>[1] & {
    onSuccess?: (data: T | undefined, message: string) => void
    onError?: (error: ApiResponse['error'], message: string) => void
}

export const apiFetch = async <T>(
    url: string,
    options?: ApiFetchOptions<T>
): Promise<T | undefined> => {
    const { onSuccess, onError, ...fetchOptions } = options || {}

    try {
        const response = await $fetch<ApiResponse<T>>(url, fetchOptions as Parameters<typeof $fetch>[1])

        if (onSuccess) {
            onSuccess(response.data, response.message)
        } else if (response.message) {
            toast.success(response.message)
        }

        return response.data
    } catch (err) {
        const error = err as ApiError
        const errorData = error.data
        const message = errorData?.message || error.statusMessage || 'An unexpected error occurred'

        if (onError) {
            onError(errorData?.error, message)
        } else {
            toast.error(message)
        }
        
        return undefined
    }
}

