'use strict'

function ConnectionManager() {
  this.sockets = {}
}

ConnectionManager.prototype.registerSocket = function(socket) {
  this.sockets[socket.name] = socket
}

ConnectionManager.prototype.removeSocket = function(socket) {
  delete this.sockets[socket.name]
}

ConnectionManager.prototype.removeAllSockets = function() {
  Object.keys(this.sockets).map(socketName => {
    this.removeSocket(this.sockets[socketName])
  })
}

ConnectionManager.prototype.getConnectedSockets = function() {
  return Object.keys(this.sockets).join('\n')
}

ConnectionManager.prototype.getAllSockets = function() {
  return this.sockets
}

ConnectionManager.prototype.totalSockets = function() {
  return Object.keys(this.sockets).length
}

module.exports = ConnectionManager
