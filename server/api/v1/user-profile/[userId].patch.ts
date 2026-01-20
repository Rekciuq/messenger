import { ErrorCode } from "~/constants/error/codes";
import userProfileSchema from '~/schemas/userProfile.schema';
import { userProfileService } from "~~/server/bll/UserProfileService";

export default defineEventHandler(async (event) => {
    const userId = getRouterParam(event, "userId");
    const { data: body, error } = await validateMultipart(event, userProfileSchema);
    if (error) {
        setResponseStatus(event, error.code);
        return apiError(error.code, error.details);
    }

    if (!userId) {
        setResponseStatus(event, ErrorCode.VALIDATION_ERROR);
        return apiError(ErrorCode.VALIDATION_ERROR, "User ID is required");
    }

    await userProfileService.updateProfileData({userId, bio: body.newBio, username: body.newUsername, profilePicture: body.newProfilePicture})

    return apiSuccess({}, "User was updated")
})
