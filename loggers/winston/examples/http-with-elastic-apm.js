// Licensed to Elasticsearch B.V under one or more agreements.
// Elasticsearch B.V licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information

'use strict'

// This example shows how @elastic/ecs-winston-format logging will integrate
// with Elastic APM (https://www.elastic.co/apm).
//
// If usage of Elastic APM is detected (i.e. the "elastic-apm-node" package
// is being used), then log records will include trace identifiers, e.g.:
//       "trace": { "id": "678f2a0189f259baf2ea17db8af5a4d0" },
//       "transaction": { "id": "1cc6339964575165" },
//       "span": { "id": "f72c52ceda81777a" },
// to correlate log and trace data in Kibana.

/* eslint-disable-next-line no-unused-vars */
const apm = require('elastic-apm-node').start({
  serviceName: 'http-with-elastic-apm',
  centralConfig: false,
  captureExceptions: false,
  metricsInterval: 0
})

const http = require('http')
const winston = require('winston')
const ecsFormat = require('../') // @elastic/ecs-winston-format

const logger = winston.createLogger({
  level: 'info',
  format: ecsFormat({ convertReqRes: true }),
  transports: [
    new winston.transports.Console()
  ]
})

const server = http.createServer(handler)
server.listen(3000, () => {
  logger.info('listening at http://localhost:3000')
})

function handler (req, res) {
  res.setHeader('Foo', 'Bar')
  res.end('ok')
  logger.info('handled request', { req, res })
}
