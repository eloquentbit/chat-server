'use strict'

const server = require('./server')

// Host and Port on which the server will listen
const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 10000

// Start the TCP server
server.listen(
  {
    host: HOST,
    port: PORT
  },
  () => {
    console.log(`Server listen on ${HOST}:${PORT}`)
  }
)
