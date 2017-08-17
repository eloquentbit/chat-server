'use strict'

const net = require('net')

// This array holds the connected sockets
let sockets = {}

// Register a socket in the sockets array
function registerSocket(socket) {
  sockets[socket.name] = socket
}

// Parse the input and remove \n and \r characters
function sanitizeInput(data) {
  return data.toString().replace(/\r\n|\n\r/gm, '')
}

// Return the list of currently connected sockets as a string
function getConnectedClients() {
  return Object.keys(sockets).join('\n')
}

// Send the specified message to all connected sockets
function broadcastMessage(message, sender) {
  Object.keys(sockets).forEach(socket => {
    const currentSocket = sockets[socket]
    if (currentSocket !== sender) {
      currentSocket.write(message)
    }
  })
}

// Create a new server
const server = net.createServer(socket => {
  // Add a name to the socket
  socket.name = `${socket.remoteAddress}:${socket.remotePort}`

  // Register the socket
  registerSocket(socket)

  // Handle the data sent from socket
  socket.on('data', data => {
    const parsedData = sanitizeInput(data)

    if (parsedData === '@list') {
      socket.write(`${getConnectedClients()}`)
    } else {
      broadcastMessage(data, socket)
    }
  })

  // When socket disconnect delete it from the sockets array
  socket.on('close', socket => {
    delete sockets[socket.name]
  })
})

// When server shutdwon close all sockets and remove them from sockets array
server.on('close', () => {
  for (const socket in sockets) {
    sockets[socket].destroy()
    delete sockets[socket]
  }
})

module.exports = server
