import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { defineEventHandler } from 'h3'
import { engine } from '../utils/websocket'
import {socketService} from "../utils/ServerSocketService"

export default defineNitroPlugin((nitroApp) => {
  socketService.connect()
  nitroApp.router.use('/socket.io/', defineEventHandler({
    handler(event) {
      // @ts-expect-error - engine.io types don't match Nitro's request type
      engine.handleRequest(event.node.req, event.node.res);
      event._handled = true;
    },
    websocket: {
      open(peer) {
        // @ts-expect-error private method and property
        engine.prepare(peer._internal.nodeReq);
        // @ts-expect-error private method and property
        engine.onWebSocket(peer._internal.nodeReq, peer._internal.nodeReq.socket, peer.websocket);
      }
    }
  }))
})