const mongoose = require('mongoose')
const { pick, range } = require('lodash')

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
        preserved: Date,
    }],
})

userSchema.methods.createBoard = async function({rows, columns, mines}) {

    if (mines > rows * columns) {
        const error = new Error(`Not enough space for ${mines} mines in a board of ${rows}x${columns}.`)
        error.status = 400
        throw error
    }

    let countMines = 0

    const board = {
        started: new Date(),
        time: 0,
        cells: range(rows).map(
            i => range(columns).map(
                j => ({
                    display: null,
                    mine: mines > countMines++,
                })
            )
        ),
    }

    this.boards.push(board)

    await this.save()

    return this.boards.length

}

userSchema.methods.toJson = function() {
    return {
        username: this.username,
        boards: this.boards.map(board => ({
            ...pick(board, ['started', 'time', 'preserved']),
            cells: board.cells.map(
                row => row.map(
                    cell => pick(cell, ['display'])
                )
            ),
        })),
    }
}

module.exports = userSchema
