import { loggerService } from './logger.service.js'
import { Server } from 'socket.io'

let gIo = null

export function setupSocketAPI(http) {
  gIo = new Server(http, {
    cors: {
      origin: '*',
    },
  })
  gIo.on('connection', (socket) => {
    loggerService.info(`New connected socket [id: ${socket.id}]`)
    socket.on('disconnect', (socket) => {
      loggerService.info(`Socket disconnected [id: ${socket.id}]`)
    })

    socket.on('chat_open', (data) => {
      const { sellerId, buyer } = data
      emitToUser({
        type: 'chat_seller_prompt',
        data: buyer,
        userId: sellerId,
      })
    })

    socket.on('chat-user-typing', (data) => {
      const { typingUser, receiverId } = data
      loggerService.info(`User is typing from socket [id: ${socket.id}]`)
      emitToUser({
        type: 'chat_add_typing',
        data: typingUser,
        userId: receiverId
      })
    })

    socket.on('chat-stop-typing', (data) => {
      const { typingUser, receiverId } = data
      loggerService.info(`User has stopped typing from socket [id: ${socket.id}]`)
      emitToUser({
        type: 'chat_remove_typing',
        data: typingUser,
        userId: receiverId
      })
    })

    socket.on('chat-send-msg', (data) => {
      const { userId, newMessage } = data
      loggerService.info(
        `New chat msg from socket [id: ${socket.id}], emitting to user: ${userId}`
      )
      emitToUser({
        type: 'chat_add_msg',
        data: newMessage,
        userId,
      })
    })

    socket.on('user-watch', (userId) => {
      loggerService.info(
        `user-watch from socket [id: ${socket.id}], on user ${userId}`
      )
      socket.join('watching:' + userId)
    })

    // User-msg
    socket.on('notify_buyer_accepted', (data) => {
      const { userId, user } = data
      loggerService.info(
        `notify_buyer_accepted from socket [id: ${socket.id}], on user ${userId}`
      )
      emitToUser({
        type: 'notify-buyer-accepted',
        data: user,
        userId,
      })
    })

    socket.on('notify_buyer_denied', (data) => {
      const { userId, user } = data
      loggerService.info(
        `notify_buyer_denied from socket [id: ${socket.id}], on user ${userId}`
      )
      emitToUser({
        type: 'notify-buyer-denied',
        data: user,
        userId,
      })
    })

    socket.on('notify_buyer_completed', (data) => {
      const { userId, user } = data
      loggerService.info(
        `notify_buyer_completed from socket [id: ${socket.id}], on user ${userId}`
      )
      emitToUser({
        type: 'notify-buyer-completed',
        data: user,
        userId,
      })
    })

    socket.on('notify_seller_new_order', (data) => {
      const { userId, user } = data
      loggerService.info(
        `notify_seller_new_order from socket [id: ${socket.id}], on user ${userId}`
      )
      emitToUser({
        type: 'notify-seller-new-order',
        data: user,
        userId,
      })
    })

    socket.on('notify_seller_order_reviewed', (data) => {
      const { userId, user } = data
      loggerService.info(
        `notify_seller_order_reviewed from socket [id: ${socket.id}], on user ${userId}`
      )
      emitToUser({
        type: 'notify-seller-order-reviewed',
        data: user,
        userId,
      })
    })

    // Auth
    socket.on('set-user-socket', (userId) => {
      loggerService.info(
        `Setting socket.userId = ${userId} for socket [id: ${socket.id}]`
      )
      socket.userId = userId
    })
    socket.on('unset-user-socket', () => {
      loggerService.info(`Removing socket.userId for socket [id: ${socket.id}]`)
      delete socket.userId
    })
  })
}

function emitTo({ type, data, label }) {
  if (label) gIo.to('watching:' + label.toString()).emit(type, data)
  else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
  if (!userId) {
    loggerService.info(`emitToUser called with undefined userId for event: ${type}`)
    return
  }
  userId = userId.toString()
  const socket = await _getUserSocket(userId)

  if (socket) {
    loggerService.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
    socket.emit(type, data)
  } else {
    loggerService.info(`No active socket for user: ${userId}`)
    // _printSockets()
  }
}

// If possible, send to all sockets BUT not the current socket
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
  userId = userId.toString()
  loggerService.info(`Broadcasting event: ${type}`)
  const excludedSocket = await _getUserSocket(userId)
  if (room && excludedSocket) {
    loggerService.info(`Broadcast to room ${room} excluding user: ${userId}`)
    excludedSocket.broadcast.to(room).emit(type, data)
  } else if (excludedSocket) {
    loggerService.info(`Broadcast to all excluding user: ${userId}`)
    excludedSocket.broadcast.emit(type, data)
  } else if (room) {
    loggerService.info(`Emit to room: ${room}`)
    gIo.to(room).emit(type, data)
  } else {
    loggerService.info(`Emit to all`)
    gIo.emit(type, data)
  }
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets()
  const socket = sockets.find((s) => s.userId === userId)
  return socket
}
async function _getAllSockets() {
  // return all Socket instances
  const sockets = await gIo.fetchSockets()
  return sockets
}

async function _printSockets() {
  const sockets = await _getAllSockets()
  console.log(`Sockets: (count: ${sockets.length}):`)
  sockets.forEach(_printSocket)
}
function _printSocket(socket) {
  console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

export const socketService = {
  // set up the sockets service and define the API
  setupSocketAPI,
  // emit to everyone / everyone in a specific room (label)
  emitTo,
  // emit to a specific user (if currently active in system)
  emitToUser,
  // Send to all sockets BUT not the current socket - if found
  // (otherwise broadcast to a room / to all)
  broadcast,
}