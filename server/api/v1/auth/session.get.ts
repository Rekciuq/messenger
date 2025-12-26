import { getAuthUser } from "../../../utils/jwt";
import { apiSuccess, apiError } from "../../../utils/response";
import { ErrorCode } from "../../../../app/constants/error/codes";
import { userRepository } from "../../../dll/UserRepository";

export default defineEventHandler(async (event) => {
    const authData = getAuthUser(event);
    
    if (!authData) {
        setResponseStatus(event, ErrorCode.UNAUTHORIZED);
        return apiError(ErrorCode.UNAUTHORIZED, "Not authenticated");
    }
    
    const user = await userRepository.findById(authData.userId);
    
    if (!user) {
        setResponseStatus(event, ErrorCode.UNAUTHORIZED);
        return apiError(ErrorCode.UNAUTHORIZED, "User not found");
    }
    
    return apiSuccess({
        id: user.id,
        email: user.email,
        userName: user.userName,
        bio: user.bio,
        profilePictureUrl: user.profilePicture.url,
        lastSeen: user.lastSeen.toISOString(),
        isOnline: user.isOnline,
    }, "Session retrieved");
});

