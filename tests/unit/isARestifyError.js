'use strict'
const test = require('tape-catch')
const errors = require('restify-errors')
const isARestifyError = require('../../lib/isARestifyError')

test('isARestifyError unit tests', (t) => {
  t.test('returns false for Errors', (t) => {
    t.plan(1)
    t.notOk(isARestifyError(new Error('test error')))
  })

  t.test('returns true for restify errors', (t) => {
    t.plan(1)
    t.ok(isARestifyError(new errors.UnauthorizedError()))
  })
})
