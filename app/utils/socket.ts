import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client'

export const setupSocket = (userId: string): Socket => io({
  autoConnect: false,
  auth: {
    userId
  }
})