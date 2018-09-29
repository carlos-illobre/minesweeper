const { createLogger, format, transports } = require('winston')

module.exports = ({ silent } = {}) => createLogger({
    level: 'debug',
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.align(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    silent,
    transports: [
        new transports.Console({
            name: 'error-console',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            exitOnError: true,
        }),
        new transports.File({
            name: 'debug-file',
            filename: 'log.log',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            exitOnError: true,
            json: false,
            maxsize: 104857600,
            maxFiles: 5,
        }),
    ],
})
