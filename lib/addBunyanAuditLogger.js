'use strict'
const auditLogger = require('./bunyanAuditLogger')
const logger = require('./bunyanLogger')

module.exports = (server) => {
  server.on('after', auditLogger({
    log: logger,
    body: true
  }))
}
