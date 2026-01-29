import type { MessageView } from "~~/server/bll/MessageService";
import { useQueryClient } from "@tanstack/vue-query";

type SocketState = {
  onlineUsers: string[];
  isConnected: boolean;
};

export const useSocketStore = defineStore("socket", {
  state: (): SocketState => ({
    onlineUsers: [],
    isConnected: false,
  }),
  getters: {
    getOnlineUsers: (state) => state.onlineUsers,
  },
  actions: {
    connect(userId: string) {
      if (this.isConnected) {
        return;
      }

      const queryClient = useQueryClient();

      socketService.connect(userId, () => {
        socketService.handleUpdatePresence((presence) => {
          this.onlineUsers = presence;
        });
        socketService.handleUpdateUserPresence(
          ({ userId: updatedUserId, presence }) => {
            const foundUser = this.onlineUsers.find(
              (id) => id === updatedUserId,
            );
            if (!foundUser && presence) {
              this.onlineUsers.push(updatedUserId);
            }

            if (foundUser && !presence) {
              this.onlineUsers = this.onlineUsers.filter(
                (id) => id !== updatedUserId,
              );
            }
          },
        );

        socketService.socket?.on("new-message", (message: MessageView) => {
          queryClient.setQueryData(
            ["messages", message.chatId],
            (old: unknown) => {
              if (!old || typeof old !== "object") return old;

              const data = old as { pages: Array<{ messages: MessageView[] }> };
              const newPages = data.pages.map((page, index) => {
                if (index === data.pages.length - 1) {
                  // Last page - add and sort messages by createdAt
                  const updatedMessages = [...page.messages, message].sort(
                    (a, b) => {
                      const dateA = new Date(a.createdAt).getTime();
                      const dateB = new Date(b.createdAt).getTime();
                      return dateA - dateB;
                    },
                  );
                  return {
                    ...page,
                    messages: updatedMessages,
                  };
                }
                return page;
              });

              return { ...data, pages: newPages };
            },
          );

          queryClient.invalidateQueries({ queryKey: ["chats"] });
        });
      });
      this.isConnected = true;
    },
  },
});
