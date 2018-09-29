const createDatabase = require('../database/createDatabase.js')
const createExpressApp = require('../app/createExpressApp.js')
const createLogger = require('../createLogger.js')
const mongoose = require('mongoose')
const { Mockgoose } = require('mockgoose')
const supertest = require('supertest')

require('events').EventEmitter.defaultMaxListeners = 0

let mockgoose

module.exports = async useLogger => {

    if (!mockgoose) {
        mockgoose = new Mockgoose(mongoose)
        await mockgoose.prepareStorage()
    }

    const logger = createLogger({ silent: !useLogger })

    const database = createDatabase({ logger, mongoose })

    const reset = async () => Promise.all(
        Object
        .values(database)
        .filter(object => object.base instanceof mongoose.constructor)
        .map(schema => schema.deleteMany())
    )

    reset()

    const testApp = supertest(createExpressApp({ logger, database }))
    testApp.db = database

    return testApp

}
