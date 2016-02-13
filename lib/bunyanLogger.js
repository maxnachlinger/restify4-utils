'use strict'
const bunyan = require('bunyan')

const logger = module.exports = bunyan.createLogger({
  name: 'info logger',
  streams: [ {
    level: 'info',
    stream: process.stdout
  } ]
})

// use logger.addStream() to add additional streams or change the above streams

module.exports.addFields = function (fields) {
  logger.fields = Object.assign(logger.fields, fields)
}

module.exports.removeField = function (field) {
  delete logger.fields[ field ]
}

module.exports.getFields = function () {
  return Object.assign({}, logger.fields)
}
