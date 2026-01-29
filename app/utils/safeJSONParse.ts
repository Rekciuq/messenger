export const safeJSONParse = <T>(json?: string | null): T | null => {
    if(json) {
        try {
            return JSON.parse(json) as T
        } catch {
            return null
        }
    }
    return null
}