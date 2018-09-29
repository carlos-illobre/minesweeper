const express = require('express')
const bodyParser = require('body-parser')
const expressWinston = require('express-winston')
const apiRouter = require('./rest/createApiRouter.js')()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./getSwaggerDocument.js')()

module.exports = ({ database, logger }) => express()
.use(expressWinston.logger({
    winstonInstance: logger,
    msg: '{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms',
    meta: false,
}))
.use(bodyParser.urlencoded({ extended: true }))
.use(bodyParser.json())
.use('/rest/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, true))
.use((req, res, next) => {
    req.base = `${req.protocol}://${req.get('host')}`
    req.logger = logger
    req.db = database
    return next()
})
.use(express.static('./public'))
.use('/rest', apiRouter)
.use((error, req, res, next) => {
    logger.error(error, error)
    return error.errors
        ? res.status(400).json(error)
        : res.status(error.status).send(error.message)
})
