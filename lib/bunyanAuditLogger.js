'use strict'
// Adapted from restify 4.x lib/plugins/audit.js
const bunyan = require('bunyan')
const HttpError = require('restify-errors').HttpError
const consts = require('./consts')

function removePasswords (obj) {
  if (obj && obj.password) {
    obj.password = '[PROTECTED]'
  }
  return obj
}

function logger (options) {
  let errSerializer = bunyan.stdSerializers.err
  if (options.log.serializers && options.log.serializers.err) {
    errSerializer = options.log.serializers.err
  }

  // for perf
  const ignoredUrls = (options.ignoredUrls || [ consts.healthCheckPath ])
    .reduce((urls, url) => {
      urls[ url ] = true
      return urls
    }, {})

  const handleReq = (req) => {
    if (!req) {
      return false
    }

    const timers = (req.timers || []).reduce((accum, time) => {
      accum[ time.name ] = Math.floor((1000000 * time.time[ 0 ]) + (time.time[ 1 ] / 1000))
      return accum
    }, {})

    const result = {
      // account for native and queryParser plugin usage
      query: (typeof req.query === 'function')
        ? req.query() : req.query,
      method: req.method,
      url: req.url,
      headers: req.headers,
      httpVersion: req.httpVersion,
      trailers: req.trailers,
      version: req.version(),
      clientClosed: req.clientClosed,
      timers: timers
    }

    if (options.body) {
      result.body = removePasswords(req.body)
    }

    return result
  }

  const handleRes = (res) => {
    if (!res) {
      return false
    }

    const result = {
      statusCode: res.statusCode,
      headers: res._headers,
      trailer: res._trailer || false
    }

    if (options.body === true) {
      if (res._body instanceof HttpError) {
        result.body = res._body.body
      } else {
        result.body = res._body
      }
      result.body = removePasswords(result.body)
    }

    return result
  }

  const log = options.log.child({
    serializers: {
      err: errSerializer,
      req: handleReq,
      res: handleRes
    }
  })

  return (req, res, route, err) => {
    if (req.url && ignoredUrls[ req.url ]) {
      return true
    }

    let latency = res.get('Response-Time')
    if (typeof (latency) !== 'number') {
      latency = Date.now() - req._time
    }

    let level = 'info'

    if (res.statusCode >= 500) {
      level = 'error'
    }

    // warn since this might be an error in our code
    if (res.statusCode === 404) {
      level = 'warn'
    }

    log[ level ]({
      remoteAddress: req.connection.remoteAddress,
      remotePort: req.connection.remotePort,
      req_id: req.getId(),
      req: req,
      res: res,
      secure: req.secure,
      latency: latency
    }, 'res.statusCode: %d', res.statusCode)

    return true
  }
}

module.exports = logger
