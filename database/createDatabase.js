const mongoose = require('mongoose')
const glob = require('glob')
const path = require('path')

module.exports = ({ logger }) => {

    const url = process.env.DOCKER_MONGODB_URL
        || 'mongodb://educacionit:educacionit@ds231739.mlab.com:31739/educacionit'

    mongoose.connect(url)

    const db = glob.sync('./schemas/**/*.js', { cwd: __dirname })
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

    mongoose
    .connection
    .on('error', error => {
        throw error
    })
    .once('open', () => logger.info(`MongoDB connected at ${url}`))

    return db

}
