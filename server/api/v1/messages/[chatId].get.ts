import { ErrorCode } from "~/constants/error/codes";
import paginationSchema from "~/schemas/pagination.schema";
import { messageService } from "~~/server/bll/MessageService";

export default defineEventHandler(async (event) => {
  const chatId = getRouterParam(event, "chatId");
  const { data: pagination, error: paginationError } = await validateQuery(
    event,
    paginationSchema,
  );
  if (paginationError) {
    setResponseStatus(event, paginationError.code);
    return apiError(paginationError.code, paginationError.details);
  }

  if (!chatId) {
    setResponseStatus(event, ErrorCode.VALIDATION_ERROR);
    return apiError(ErrorCode.VALIDATION_ERROR, "Chat ID is required");
  }

  const [messages, totalCount] = await Promise.all([
    messageService.getMessagesByChatId(chatId, pagination),
    messageService.getMessageCount(chatId),
  ]);

  return apiSuccess({
    ...messages,
    totalCount,
  });
});
