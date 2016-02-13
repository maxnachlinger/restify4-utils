'use strict'
const consts = require('./consts')

module.exports = (server) => {
  server.get({
    description: 'Health check',
    path: consts.healthCheckPath
  }, (req, res, next) => setImmediate(() => {
    res.send(200)
    next()
  }))
}
