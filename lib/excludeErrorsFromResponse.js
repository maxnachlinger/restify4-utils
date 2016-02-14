'use strict'
const errors = require('restify-errors')

module.exports = (server) => {
  // wraps formatters in a simple function to exclude error responses

  Object.keys(server.formatters).forEach((name) => {
    const oldFormatter = server.formatters[ name ]

    server.formatters[ name ] = (req, res, body, next) => {
      if (body instanceof Error
        && !(body instanceof errors.HttpError)
        && !(body instanceof errors.RestError)
      ) {
        body = new errors.InternalServerError('Internal Server Error')
      }

      return oldFormatter(req, res, body, next)
    }
  })
}
