'use strict'
const restifyErrors = require('restify-errors')

module.exports = (error) => {
  if (!error.name) {
    return true
  }

  return !restifyErrors[ error.name ]
}
