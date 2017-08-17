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
      done()
    })
  })
})
