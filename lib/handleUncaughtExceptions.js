'use strict'
const restifyErrors = require('restify-errors')

module.exports = (server, logger) => {
  server.on('uncaughtException', (req, res, route, err) => {
    let logFn = logger || req.log
    if (logFn) {
      logFn.error(err.stack || err)
    }

    res.send(new restifyErrors.InternalServerError('Internal Server Error'))
  })
}
