# Chat Server

> A basic chat server written in Node.js

## Prerequisites
* Node.js 6.x+
* Yarn (or npm)

## Setting up

Clone the repository:

```shell
git clone https://github.com/eloquentbit/chat-server
cd chat-server/
yarn install (or npm install)
```

## Run

Run the server with:

```shell
node index.js
```

The server will listen on port __10000__

The server recognizes two commands:

* __@list__: list all connected clients
* __@exit__: disconnect the client

## Tests

To run the tests:

```shell
yarn test
```

## Style guide

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
## Licensing

Chat Server is released under the [MIT License](https://opensource.org/licenses/MIT).