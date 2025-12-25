import { getAuthUser, refreshAccessToken, setAuthCookies } from "../utils/jwt";
import { apiError } from "../utils/response";
import { ErrorCode } from "../../app/constants/error/codes";

const PUBLIC_API_ROUTES = [
    "/api/v1/auth/login",
    "/api/v1/auth/signup",
    "/api/v1/auth/refresh",
];

export default defineEventHandler(async (event) => {
    const path = getRequestURL(event).pathname;
    
    if (PUBLIC_API_ROUTES.some(route => path.startsWith(route))) {
        return;
    }
    
    if (path.startsWith("/api/")) {
        let user = getAuthUser(event);
        
        if (!user) {
            const tokens = refreshAccessToken(event);
            
            if (tokens) {
                setAuthCookies(event, tokens);
                user = getAuthUser(event);
            }
        }
        
        if (!user) {
            setResponseStatus(event, ErrorCode.UNAUTHORIZED);
            throw createError({
                statusCode: ErrorCode.UNAUTHORIZED,
                statusMessage: "Unauthorized",
                data: apiError(ErrorCode.UNAUTHORIZED, "Authentication required")
            });
        }
        
        event.context.user = user;
    }
});

