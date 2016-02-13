# restify4-utils

A set of utils I use a lot when using restify 4.x on projects.
If I'm the only one who ever uses this, then I'll have succeeded :)

[![npm][npm-image]][npm-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/restify4-utils.svg?style=flat
[npm-url]: https://npmjs.org/package/restify4-utils
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/

### Installation:
```
npm install restify4-utils --save
```

### Utils
The following utils are provided:

- A [Bunyan logger](https://github.com/maxnachlinger/restify4-utils/blob/master/lib/bunyanLogger.js) which simply logs things to ``process.stdout``, you can also add additional logging streams to this logger if you need them.
- An [Bunyan audit logger](https://github.com/maxnachlinger/restify4-utils/blob/master/lib/bunyanAuditLogger.js) which uses the ``bunyanLogger`` above and prints timing info for server calls.  You can use it as it is, or add it to you server instance via [addBunyanAuditLogger](https://github.com/maxnachlinger/restify4-utils/blob/master/lib/addBunyanAuditLogger.js).
- A [formatter wrapper](https://github.com/maxnachlinger/restify4-utils/blob/master/lib/excludeErrorsFromResponse.js) to keep error details from going out in server responses.
- A simple [``uncaughtException`` handler](https://github.com/maxnachlinger/restify4-utils/blob/master/lib/handleUncaughtExceptions.js) which logs the exception and sends a vanilla 500 response.
- A simple [healthcheck route](https://github.com/maxnachlinger/restify4-utils/blob/master/lib/addHealthCheck.js).

### Example
```javascript
'use strict'
const restify = require('restify')
const restify4Utils = require('restify4-utils')

const port = 8080
const logger = restify4Utils.bunyanLogger

const server = restify.createServer({
  log: logger
})

restify4Utils.excludeErrorsFromResponse(server)

server.use(restify.acceptParser(server.acceptable))
server.use(restify.gzipResponse())
server.use(restify.authorizationParser())
server.use(restify.requestLogger())

restify4Utils.handleUncaughtExceptions(server)
restify4Utils.addBunyanAuditLogger(server)
restify4Utils.addHealthCheck(server)

server.listen(port, (err) => {
  if (err) {
    logger.error('Unable to start server', err.stack || err)
    process.exit(1)
  }
  logger.info(`Server listening on port: ${port}`)
})

server.get({
  description: 'Simple GET which returns next(err)',
  path: '/error/nodejs/next'
}, (req, res, next) => {
  // simulates async work
  setTimeout(() => {
    next(new Error('Test error'))
  }, 500)
})

server.get({
  description: 'Simple GET triggering an uncaughtException',
  path: '/error/nodejs/throw'
}, () => {
  // simulates async work
  setTimeout(() => {
    throw new Error('Test error')
  }, 500)
})
```

Once that server is running, try these cURLs:

```shell
curl "http://localhost:8080/error/nodejs/next" -verbose
curl "http://localhost:8080/error/nodejs/throw" -verbose
curl "http://localhost:8080/healthcheck" -verbose
```
