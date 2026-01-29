import type { Socket, Server } from "socket.io";
import type { Socket as ClientSocket } from "socket.io-client";

export enum SocketKeys {
  Connect = "connect",
  Connection = "connection",
  Disconnect = "disconnect",
  SendMessage = "send-message",
  JoinRoom = "join-room",
  UpdatePresence = "update-presence",
  UpdateUserPresence = "update-user-presence",
}

export type SendMessageEventProps = {
  toId: string;
  text: string;
  tempId: string;
};

export type SocketMessageType = SendMessageEventProps & { createdAt: string };

export type MessageAck =
  | { success: true; message: MessageView }
  | { success: false; error: string };

export type MessageView = {
  id: string;
  text: string;
  createdAt: string;
  senderId: string;
  chatId: string;
};

export type InterServerEvents = {
  ping: () => void;
};

export type SocketData = {
  relatedUsers: string[];
};

export type ServerToClientEvents = {
  [SocketKeys.UpdatePresence]: (presence: string[]) => void;
  [SocketKeys.UpdateUserPresence]: (presence: {
    userId: string;
    presence: boolean;
  }) => void;
  "new-message": (message: MessageView) => void;
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
};

export type ClientToServerEvents = {
  [SocketKeys.SendMessage]: (
    data: SendMessageEventProps,
    callback: (response: MessageAck) => void,
  ) => void;
  [SocketKeys.JoinRoom]: (data: { userId: string; chatId: string }) => void;
};

export type ServerSocketType = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type ClientSocketType = ClientSocket<
  ServerToClientEvents,
  ClientToServerEvents
>;

export type ServerWebsocketServerType = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
