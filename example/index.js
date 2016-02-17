'use strict'
const restify = require('restify')
const restify4Utils = require('..')

const port = 8080
const logger = restify4Utils.bunyanLogger

const server = restify.createServer({
  log: logger
})

restify4Utils.excludeErrorsFromResponse(server, logger)

server.use(restify.acceptParser(server.acceptable))
server.use(restify.gzipResponse())
server.use(restify.authorizationParser())
server.use(restify.requestLogger())

restify4Utils.handleUncaughtExceptions(server, logger)
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
  // simulate async work
  setTimeout(() => {
    next(new Error('Test error'))
  }, 500)
})

server.get({
  description: 'Simple GET triggering an uncaughtException',
  path: '/error/nodejs/throw'
}, () => {
  // simulate async work
  setTimeout(() => {
    throw new Error('Test error')
  }, 500)
})
