import { userRepository } from "../../../dll/UserRepository";
import { apiSuccess, apiError } from "../../../utils/response";
import { ErrorCode } from "../../../../app/constants/error/codes";

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.userId;
  if (!userId) {
    setResponseStatus(event, ErrorCode.UNAUTHORIZED);
    return apiError(ErrorCode.UNAUTHORIZED, "Unauthorized");
  }

  const query = getQuery(event);
  const searchQuery = query.q?.toString() || "";

  if (!searchQuery || searchQuery.length < 2) {
    return apiSuccess([]);
  }

  try {
    const usersWithChats = await userRepository.findUsersWithoutChat(
      userId,
      searchQuery,
    );
    return apiSuccess(usersWithChats);
  } catch (error) {
    console.error("Error searching users:", error);
    setResponseStatus(event, ErrorCode.INTERNAL_SERVER_ERROR);
    return apiError(ErrorCode.INTERNAL_SERVER_ERROR, "Failed to search users");
  }
});
