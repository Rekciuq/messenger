import { refreshAccessToken, setAuthCookies } from "../../../utils/jwt";
import { apiSuccess, apiError } from "../../../utils/response";
import { ErrorCode } from "../../../../app/constants/error/codes";

export default defineEventHandler(async (event) => {
    const tokens = refreshAccessToken(event);
    
    if (!tokens) {
        setResponseStatus(event, ErrorCode.UNAUTHORIZED);
        return apiError(ErrorCode.UNAUTHORIZED, "Invalid or expired refresh token");
    }
    
    setAuthCookies(event, tokens);
    
    return apiSuccess({ refreshed: true }, "Token refreshed successfully");
});

