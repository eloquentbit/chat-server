const net = require('net')
const assert = require('chai').assert
const ConnectionManager = require('../lib/ConnectionManager')

let connectionManager

function createSocket(address, port) {
  const socket = new net.Socket()
  socket.name = `${address}:${port}`

  return socket
}

describe('ConnectionManager', function() {
  before(function() {
    connectionManager = new ConnectionManager()
  })

  it('should initialize the sockets array', function() {
    assert.equal(connectionManager.totalSockets(), 0)
  })

  it('should register a new socket', function() {
    const socket = createSocket('127.0.0.1', '13456')
    connectionManager.registerSocket(socket)
    assert.equal(connectionManager.totalSockets(), 1)
  })

  it('should remove a socket', function() {
    const socket = createSocket('127.0.0.1', '13456')
    connectionManager.registerSocket(socket)

    assert.equal(connectionManager.totalSockets(), 1)
    connectionManager.removeSocket(socket)
    assert.equal(connectionManager.totalSockets(), 0)
  })

  it('should remove all sockets', function() {
    const firstSocket = createSocket('127.0.0.1', '13456')
    connectionManager.registerSocket(firstSocket)

    const secondSocket = createSocket('127.0.0.1', '13457')
    connectionManager.registerSocket(secondSocket)

    assert.equal(connectionManager.totalSockets(), 2)

    connectionManager.removeAllSockets()

    assert.equal(connectionManager.totalSockets(), 0)
  })

  it('should list all registered sockets', function() {
    const firstSocket = createSocket('127.0.0.1', '13456')
    connectionManager.registerSocket(firstSocket)

    const secondSocket = createSocket('127.0.0.1', '13457')
    connectionManager.registerSocket(secondSocket)

    const thirdSocket = createSocket('127.0.0.1', '13458')
    connectionManager.registerSocket(thirdSocket)

    const connectedSocketsString = connectionManager.getConnectedSockets()

    assert.strictEqual(
      connectedSocketsString,
      `${firstSocket.name}\n${secondSocket.name}\n${thirdSocket.name}`
    )
  })
})
