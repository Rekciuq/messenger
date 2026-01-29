import { Server as Engine } from 'engine.io'
import { Server } from 'socket.io'
import type { ServerWebsocketServerType  } from "../../types/websockets"

export const engine = new Engine();

const io: ServerWebsocketServerType = new Server();

io.bind(engine)

export const serverSocket = io;
