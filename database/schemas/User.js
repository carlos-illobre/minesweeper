const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    boards: [{
        gameover: Boolean,
        started: Date,
        time: Number,
        cells: [
            [{
                display: String,
                mine: Boolean,
            }],
        ],
    }],
})

module.exports = userSchema
