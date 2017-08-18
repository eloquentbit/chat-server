const net = require('net')
const stoppable = require('stoppable')
const assert = require('chai').assert
const server = require('../server')

const PORT = 10000

let testServer

describe('Chat server', function() {
  before(function() {
    testServer = stoppable(
      server.listen({
        host: '0.0.0.0',
        port: PORT
      }),
      0
    )
  })

  after(function() {
    testServer.stop()
  })

  it('should listen on specified port', function(done) {
    const client = net.createConnection({ port: PORT }, function() {
      assert.isNotNull(client)
      client.end()
      done()
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

  it('should disconnect a client when @end is received', function(done) {
    const client = net
      .createConnection({ port: PORT }, () => {
        client.write('@exit')
        done()
      })
      .on('end', () => {
        assert.isTrue(client.destroyed)
        assert.isNull(client)
      })
  })
})
