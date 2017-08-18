'use strict'

/**
 * Constructor
 */
function ConnectionManager() {
  this.sockets = {}
}

/**
 * Register a new socket
 * @param socket The socket to register
 */
ConnectionManager.prototype.registerSocket = function(socket) {
  this.sockets[socket.name] = socket
}

/**
 * Remove a socket
 * @param socket The socket to remove
 */
ConnectionManager.prototype.removeSocket = function(socket) {
  delete this.sockets[socket.name]
}

/**
 * Remove all sockets
 */
ConnectionManager.prototype.removeAllSockets = function() {
  Object.keys(this.sockets).map(socketName => {
    this.removeSocket(this.sockets[socketName])
  })
}

/**
 * Return a string with all connected sockets
 */
ConnectionManager.prototype.getConnectedSockets = function() {
  return Object.keys(this.sockets).join('\n')
}

/**
 * Return all sockets
 */
ConnectionManager.prototype.getAllSockets = function() {
  return this.sockets
}

/**
 * Register the total number of connected sockets
 */
ConnectionManager.prototype.totalSockets = function() {
  return Object.keys(this.sockets).length
}

module.exports = ConnectionManager
