import { ErrorCode } from "~/constants/error/codes";
import { authService } from "~~/server/bll/AuthService";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { isOnline } = body;
    const user = getAuthUser(event);
    if (!user) {
        setResponseStatus(event, ErrorCode.UNAUTHORIZED);
        return apiError(ErrorCode.UNAUTHORIZED, "Unauthorized");
    }
    await authService.updateOnlineStatus(user.userId, isOnline);
    return apiSuccess(null, "Online status updated");
});