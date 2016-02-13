'use strict'
const restifyErrors = require('restify-errors')

module.exports = (server) => {
  server.on('uncaughtException', (req, res, route, err) => {
    if(req.log) {
      req.log.error(err.stack || err)
    }

    res.send(new restifyErrors.InternalServerError('Internal Server Error'))
  })
}
