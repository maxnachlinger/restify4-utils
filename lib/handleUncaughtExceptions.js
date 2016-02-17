'use strict'
const restifyErrors = require('restify-errors')
const isARestifyError = require('./isARestifyError')

module.exports = (server, logger) => {
  server.on('uncaughtException', (req, res, route, err) => {
    let logFn = logger || req.log
    if (logFn) {
      logFn.error(err.stack || err)
    }

    if (isARestifyError(err)) {
      res.send(err)
      return
    }

    res.send(new restifyErrors.InternalServerError('Internal Server Error'))
  })
}
