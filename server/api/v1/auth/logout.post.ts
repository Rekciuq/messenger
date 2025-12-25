import { clearAuthCookies } from "../../../utils/jwt";
import { apiSuccess } from "../../../utils/response";

export default defineEventHandler(async (event) => {
    clearAuthCookies(event);
    
    return apiSuccess(null, "Logout successful");
});

