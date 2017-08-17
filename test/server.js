const net = require('net')
const stoppable = require('stoppable')
const assert = require('chai').assert
const server = require('../server')

const PORT = 10000

let testServer

beforeEach(function() {
  testServer = stoppable(
    server.listen({
      host: '0.0.0.0',
      port: PORT
    }),
    0
  )
})

afterEach(function() {
  testServer.stop()
})

describe('Basic setup', function() {
  it('should work', function() {
    assert.equal(true, true)
  })
})

describe('Chat server', function() {
  it('should listen on specified port', function(done) {
    const client = net.createConnection({ port: PORT }, function() {
      assert.isNotNull(client)
      client.end()
      done()
    })
  })

  it('should list all the connected clients when @list command is sent', function(
    done
  ) {
    let serverResponse = ''
    let firstClientName = ''
    let secondClientName = ''
    const firstClient = net.createConnection({ port: PORT }, () => {
      firstClientName = `${firstClient.localAddress}:${firstClient.localPort}`
    })
    const secondClient = net
      .createConnection({ port: PORT }, () => {
        secondClientName = `${secondClient.localAddress}:${secondClient.localPort}`
        secondClient.write('@list')
        firstClient.end()
        secondClient.end()
        done()
      })
      .on('data', data => {
        serverResponse = data.toString()
      })
      .on('end', () => {
        assert.strictEqual(
          serverResponse,
          `${firstClientName}\n${secondClientName}`
        )
      })
  })

  it('should broadcast a message to other clients', function(done) {
    const message = 'Hello World!'
    const firstClient = net
      .createConnection({ port: PORT })
      .on('data', data => {
        assert.isNull(data)
      })

    const secondClient = net
      .createConnection({ port: PORT }, () => {
        firstClient.write(message)
      })
      .on('data', data => {
        assert.strictEqual(data.toString(), message)
        firstClient.end()
        secondClient.end()
        done()
      })
  })
})
