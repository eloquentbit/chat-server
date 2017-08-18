'use strict'

const net = require('net')
const ConnectionManager = require('./lib/ConnectionManager')

// Parse the input and remove \n and \r characters
function sanitizeInput(data) {
  return data.toString().replace(/\r\n|\n\r/gm, '')
}

// Send the specified message to all connected sockets except the sender
function broadcastMessage(message, sender) {
  const sockets = connectionManager.getAllSockets()
  Object.keys(sockets).forEach(socket => {
    const currentSocket = sockets[socket]
    if (currentSocket !== sender) {
      currentSocket.write(message)
    }
  })
}

// Create a new ConnectionManager
const connectionManager = new ConnectionManager()

// Create a new server
const server = net.createServer(socket => {
  // Add a name to the socket
  socket.name = `${socket.remoteAddress}:${socket.remotePort}`

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

// Remove all sockets on server shutdwon
server.on('close', () => {
  console.log('Server on close called')
  connectionManager.removeAllSockets()
})

module.exports = server
