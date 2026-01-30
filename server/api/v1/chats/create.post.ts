import { chatRepository } from "../../../dll/ChatRepository";
import { messageService } from "../../../bll/MessageService";
import { apiSuccess, apiError } from "../../../utils/response";
import { ErrorCode } from "../../../../app/constants/error/codes";

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.userId;
  if (!userId) {
    setResponseStatus(event, ErrorCode.UNAUTHORIZED);
    return apiError(ErrorCode.UNAUTHORIZED, "Unauthorized");
  }

  const body = await readBody(event);
  const { participantId } = body;

  if (!participantId || typeof participantId !== "string") {
    setResponseStatus(event, ErrorCode.VALIDATION_ERROR);
    return apiError(ErrorCode.VALIDATION_ERROR, "Participant ID is required");
  }

  if (participantId === userId) {
    setResponseStatus(event, ErrorCode.VALIDATION_ERROR);
    return apiError(
      ErrorCode.VALIDATION_ERROR,
      "Cannot create chat with yourself",
    );
  }

  try {
    const existingChat = await chatRepository.findChatBetweenUsers(
      userId,
      participantId,
    );

    if (existingChat) {
      return apiSuccess({ chatId: existingChat.id, existed: true });
    }

    const newChat = await chatRepository.createChat(userId, participantId);

    await messageService.createMessage({
      text: "Hi! It's nice to meet you",
      senderId: userId,
      chatId: newChat.id,
    });

    return apiSuccess({ chatId: newChat.id, existed: false });
  } catch (error) {
    console.error("Error creating chat:", error);
    setResponseStatus(event, ErrorCode.INTERNAL_SERVER_ERROR);
    return apiError(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to create chat");
  }
});
