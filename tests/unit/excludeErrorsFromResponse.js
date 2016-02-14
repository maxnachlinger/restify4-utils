'use strict'
const test = require('tape-catch')
const sinon = require('sinon')
const errors = require('restify-errors')
const restify = require('restify')
const excludeErrorsFromResponse = require('../../lib/excludeErrorsFromResponse')

test('excludeErrorsFromResponse unit tests', (t) => {
  const server = restify.createServer()
  excludeErrorsFromResponse(server)

  const jsonFormatter = server.formatters['application/json']
  Add
  const resStub = {
    send: sinon.stub(),
    setHeader: sinon.stub()
  }

  const cbJSONParse = (cb) => (err, data) => {
    if (err) {
      cb(err)
    }
    cb(null, JSON.parse(data))
  }

  t.test('transforms Error bodies', (t) => {
    const body = new Error('test error')

    jsonFormatter({}, resStub, body, cbJSONParse((err, data) => {
      t.notOk(err, 'Does not error')
      t.deepEqual(data, new errors.InternalServerError('Internal Server Error').body, 'Transforms Error')
      t.end()
    }))
  })

  t.test('ignores relevant bodies', (t) => {
    [
      {
        name: 'HttpError',
        input: new errors.BadRequestError('Bad Request'),
        expectedOutput: new errors.BadRequestError('Bad Request').body
      },
      {
        name: 'object',
        input: { name: 'Test' }
      },
      {
        name: 'string',
        input: 'Test'
      }
    ].forEach((testData) => {
      return jsonFormatter({}, resStub, testData.input, cbJSONParse((err, data) => {
        t.notOk(err, 'Does not error')
        t.deepEqual(data, testData.expectedOutput || testData.input, `Passes ${testData.name} bodies through.`)
      }))
    })
    t.end()
  })
})
