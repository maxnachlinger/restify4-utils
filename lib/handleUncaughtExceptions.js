'use strict'
const restifyErrors = require('restify-errors')
const notARestifyError = require('./notARestifyError')

module.exports = (server, logger) => {
  server.on('uncaughtException', (req, res, route, err) => {
    let logFn = logger || req.log
    if (logFn) {
      logFn.error(err.stack || err)
    }

    if (res.finished) {
      return true
    }

    if (notARestifyError(err)) {
      err = new restifyErrors.InternalServerError('Internal Server Error')
    }

    res.send(err)
    return true
  })
}
