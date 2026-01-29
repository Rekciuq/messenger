import type { ServerSocketType, MessageAck } from "~~/types/websockets";
import { SocketKeys } from "~~/types/websockets";
import { serverSocket } from "./websocket";
import { authService } from "../bll/AuthService";
import { userRepository } from "../dll/UserRepository";
import { messageService } from "../bll/MessageService";
import { chatRepository } from "../dll/ChatRepository";

const getSocketAuthUserId = (socket: ServerSocketType): string =>
  socket.handshake.auth.userId;

const onlineUsers = new Map<string, Set<string>>();

class BackendSocketService {
  socket = serverSocket;

  connect() {
    this.socket.on(SocketKeys.Connection, async (socket) => {
      const userId = getSocketAuthUserId(socket);

      await socket.join(`user:${userId}`);

      socket.data.relatedUsers = await userRepository.findRelatedUsers(userId);

      this.handleConnection(socket);

      socket.on(SocketKeys.Disconnect, () => this.handleDisconnect(socket));

      socket.on(SocketKeys.SendMessage, async (data, callback) => {
        try {
          const senderId = getSocketAuthUserId(socket);

          if (!senderId) {
            const errorResponse: MessageAck = {
              success: false,
              error: "Unauthorized: No user ID found",
            };
            callback(errorResponse);
            return;
          }

          if (!data.text || !data.text.trim()) {
            const errorResponse: MessageAck = {
              success: false,
              error: "Message text cannot be empty",
            };
            callback(errorResponse);
            return;
          }

          if (!data.toId) {
            const errorResponse: MessageAck = {
              success: false,
              error: "Chat ID is required",
            };
            callback(errorResponse);
            return;
          }

          const chatId = data.toId;

          try {
            await chatRepository.findById(chatId);
          } catch {
            const errorResponse: MessageAck = {
              success: false,
              error: "Chat not found",
            };
            callback(errorResponse);
            return;
          }

          const message = await messageService.createMessage({
            text: data.text.trim(),
            senderId,
            chatId,
          });

          const successResponse: MessageAck = {
            success: true,
            message,
          };
          callback(successResponse);

          socket.data.relatedUsers.forEach((relUserId) => {
            if (relUserId !== senderId) {
              this.socket.to(`user:${relUserId}`).emit("new-message", message);
            }
          });
        } catch (error) {
          console.error("Error handling send-message:", error);
          const errorResponse: MessageAck = {
            success: false,
            error:
              error instanceof Error ? error.message : "Failed to send message",
          };
          callback(errorResponse);
        }
      });
    });
  }

  handleConnection(socket: ServerSocketType) {
    const userId = getSocketAuthUserId(socket);
    this.updatePresenceMap(socket, true);

    const userSockets = onlineUsers.get(userId);
    if (userSockets && userSockets.size === 1) {
      this.handleUpdateUserStatus({ userId, isConnected: true });
    }

    this.emitInitialPresence(socket);
    this.broadcastPresence(socket, true);
  }

  handleDisconnect(socket: ServerSocketType) {
    const userId = getSocketAuthUserId(socket);
    this.updatePresenceMap(socket, false);

    if (!onlineUsers.has(userId)) {
      authService.updateOnlineStatus(userId, false);
      this.broadcastPresence(socket, false);
    }
  }

  updatePresenceMap(socket: ServerSocketType, presence: boolean) {
    const userId = getSocketAuthUserId(socket);
    if (presence) {
      const userSocketSet = onlineUsers.get(userId) || new Set<string>();
      userSocketSet.add(socket.id);
      onlineUsers.set(userId, userSocketSet);
    } else {
      const userSocketSet = onlineUsers.get(userId);
      if (!userSocketSet) {
        return;
      }

      if (userSocketSet.size > 1) {
        userSocketSet.delete(socket.id);
      } else {
        onlineUsers.delete(userId);
      }
    }
  }

  emitInitialPresence(socket: ServerSocketType) {
    const activeRelatedUsers = socket.data.relatedUsers.filter((relId) =>
      onlineUsers.has(relId),
    );

    socket.emit(SocketKeys.UpdatePresence, activeRelatedUsers);
  }

  broadcastPresence(socket: ServerSocketType, presence: boolean) {
    const userId = getSocketAuthUserId(socket);
    const relatedUsers = socket.data.relatedUsers;

    relatedUsers.forEach((relUser) => {
      if (onlineUsers.has(relUser)) {
        this.socket
          .to(`user:${relUser}`)
          .emit(SocketKeys.UpdateUserPresence, { userId, presence });
      }
    });
  }

  handleUpdateUserStatus({
    userId,
    isConnected,
  }: {
    userId: string;
    isConnected: boolean;
  }) {
    authService.updateOnlineStatus(userId, isConnected);
  }
}

export const socketService = new BackendSocketService();
