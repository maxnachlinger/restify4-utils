'use strict'
const test = require('tape-catch')
const errors = require('restify-errors')
const notARestifyError = require('../../lib/notARestifyError')

test('isARestifyError unit tests', (t) => {
  t.test('returns true for Errors', (t) => {
    t.plan(1)
    t.ok(notARestifyError(new Error('test error')))
  })

  t.test('returns false for restify errors', (t) => {
    t.plan(1)
    t.notOk(notARestifyError(new errors.UnauthorizedError()))
  })
})
