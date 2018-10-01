const glob = require('glob')
const path = require('path')

module.exports = ({
    logger,
    mongoose,
}) => {

    const url = process.env.MONGODB_URL
           || 'mongodb://educacionit:educacionit@ds231739.mlab.com:31739/educacionit'
    
    mongoose.set('debug', (coll, method, query, doc, options = {}) => {
        logger.info(`${coll},${method},${JSON.stringify(query)},${JSON.stringify(options)}`)
    })

    mongoose.connect(url, { useNewUrlParser: true })

    const db = glob.sync('../models/**/*.js', {
        cwd: __dirname,
        ignore: '../models/**/*.test.js',
    })
    .map(filename => {
        return {
            schema: require(filename),
            name: path
            .basename(filename)
            .replace(path.extname(filename), ''),
        }
    })
    .map(({name, schema}) => mongoose.model(name, schema))
    .reduce((db, model) => {
        return {
            ...db,
            [model.modelName]: model,
        }
    }, {})

    mongoose.connection.once('open', () => logger.info(`MongoDB connected at ${url}`))

    db.mongoose = mongoose

    return db

}

