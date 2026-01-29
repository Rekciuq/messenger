import {
  SocketKeys,
  type ClientSocketType,
  type SendMessageEventProps,
  type MessageAck,
} from "../../types/websockets";

class ClientSocketService {
  socket: ClientSocketType | null = null;

  constructor() {
    this.socket = null;
  }

  connect(userId: string, callback?: () => void) {
    this.socket = setupSocket(userId);
    this.socket.connect();

    this.socket.on(SocketKeys.Connect, () => {
      this.socket?.emit(SocketKeys.JoinRoom, { userId, chatId: userId });
      callback?.();
    });
  }

  handleUpdatePresence(callback: (presence: string[]) => void) {
    this.socket?.off(SocketKeys.UpdatePresence);
    this.socket?.on(SocketKeys.UpdatePresence, callback);
  }

  handleUpdateUserPresence(
    callback: ({
      userId,
      presence,
    }: {
      userId: string;
      presence: boolean;
    }) => void,
  ) {
    this.socket?.off(SocketKeys.UpdateUserPresence);
    this.socket?.on(SocketKeys.UpdateUserPresence, callback);
  }

  async sendMessage({
    toId,
    text,
  }: Omit<SendMessageEventProps, "tempId">): Promise<MessageAck> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Socket not connected"));
        return;
      }

      if (!this.socket.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      const tempId = crypto.randomUUID();

      this.socket.emit(
        SocketKeys.SendMessage,
        { toId, text, tempId },
        (response: MessageAck) => {
          if (response.success) {
            resolve(response);
          } else {
            reject(new Error(response.error));
          }
        },
      );

      // Timeout after 5 seconds
      setTimeout(() => {
        reject(new Error("Message send timeout"));
      }, 5000);
    });
  }
}

export const socketService = new ClientSocketService();
