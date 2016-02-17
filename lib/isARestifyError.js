'use strict'
const restifyErrors = require('restify-errors')

module.exports = (error) => {
  if (!error.name) {
    return false
  }

  return error.name && restifyErrors[ error.name ]
}
