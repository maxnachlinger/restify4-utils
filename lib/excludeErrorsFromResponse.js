'use strict'
const errors = require('restify-errors')
const notARestifyError = require('./notARestifyError')

module.exports = (server, logger) => {
  // wraps formatters in a simple function to exclude error responses

  Object.keys(server.formatters).forEach((name) => {
    const oldFormatter = server.formatters[ name ]

    server.formatters[ name ] = (req, res, body, next) => {
      if (body instanceof Error && notARestifyError(body)) {
        let logFn = logger || req.log
        if (logFn) {
          logFn.error(body.stack || body)
        }
        body = new errors.InternalServerError('Internal Server Error')
      }

      return oldFormatter(req, res, body, next)
    }
  })
}
