import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import { Server as Engine } from 'engine.io'
import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'

export default defineNitroPlugin((nitroApp) => {
  const engine = new Engine()
  const io = new Server()

  io.bind(engine)

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)
    
    socket.on('room-join', (data) => {
      console.log('User joined room:', data)
      
      // If userId is provided, store it on the socket
      if (data.userId && !socket.data.userId) {
        socket.data.userId = data.userId
        console.log('User ID stored:', data.userId)
      }
      
      // If chatId is provided and no userId is stored yet, 
      // and this looks like an initial connection (userId format), store it
      if (data.chatId && !socket.data.userId && !data.userId) {
        // Check if chatId is actually a userId (you may want to adjust this logic)
        // For now, we'll store it if it's the first room-join
        socket.data.userId = data.chatId
        console.log('User ID stored from chatId:', data.chatId)
      }
      
      // TODO: Implement room joining logic
      if (data.userId) {
        socket.join(`user:${data.userId}`)
      }
      if (data.chatId) {
        socket.join(`chat:${data.chatId}`)
      }
    })
    
    socket.on('disconnect', () => {
      const userId = socket.data.userId
      if (userId) {
        console.log('User disconnected:', socket.id, '- User ID:', userId)
      } else {
        console.log('User disconnected:', socket.id)
      }
    })
    
    socket.on('room-leave', (data) => {
      console.log('User left room:', data)
      // TODO: Implement room leaving logic
      if (data.chatId) {
        socket.leave(`chat:${data.chatId}`)
      }
    })
    
    socket.on('message', (data) => {
      console.log('Message received:', data)
      // TODO: Implement message broadcasting logic
      // Example: io.to(`chat:${data.chatId}`).emit('message', data)
    })
  })

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