import { ErrorCode } from "~/constants/error/codes";
import { chatService } from "~~/server/bll/ChatService";

export default defineEventHandler(async (event) => {
    const userId = getRouterParam(event, "userId");

    if (!userId) {
        setResponseStatus(event, ErrorCode.VALIDATION_ERROR);
        return apiError(ErrorCode.VALIDATION_ERROR, "User ID is required");
    }

    const chat = await chatService.getChatsById(userId);

    if (!chat) {
        setResponseStatus(event, ErrorCode.NOT_FOUND);
        return apiError(ErrorCode.NOT_FOUND, "User not found");
    }

    return apiSuccess(chat);
});