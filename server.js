'use strict'

const net = require('net')
const ConnectionManager = require('./lib/ConnectionManager')

/**
 * Parse the input removing \n and \r characters
 * @param data The data to parse
 */
function sanitizeInput(data) {
  return data.toString().replace(/\r\n|\n\r/gm, '')
}

/**
 * Send the specified message to all connected sockets except the sender
 * @param message The message to send
 * @param sender The sender of the message
 */
function broadcastMessage(message, sender) {
  const sockets = connectionManager.getAllSockets()
  Object.keys(sockets).forEach(socket => {
    const currentSocket = sockets[socket]
    if (currentSocket !== sender) {
      currentSocket.write(message)
    }
  })
}

/**
 * Create a new ConnectionManager
 */
const connectionManager = new ConnectionManager()

/**
 * Create a new server
 */
const server = net.createServer(socket => {
  // Add a name to the socket
  socket.name = `${socket.remoteAddress}:${socket.remotePort}`

  // Print the client name on the console
  console.log(`New client connected: ${socket.name}`)

  // Register the socket
  connectionManager.registerSocket(socket)

  // Handle the data sent from socket
  socket.on('data', data => {
    const parsedData = sanitizeInput(data)

    if (parsedData === '@list') {
      socket.write(`${connectionManager.getConnectedSockets()}\n`)
    } else if (parsedData === '@exit') {
      connectionManager.removeSocket(socket)
      socket.destroy()
    } else {
      broadcastMessage(data, socket)
    }
  })

  // Remove socket on disconnect
  socket.on('close', () => {
    connectionManager.removeSocket(socket)
    socket.destroy()
  })
})

/**
 * Remove all sockets on server shutdwon
 */
server.on('close', () => {
  console.log('Server on close called')
  connectionManager.removeAllSockets()
})

module.exports = server
