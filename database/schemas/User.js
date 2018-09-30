const mongoose = require('mongoose')

const { pick, range, floor, sample, without } = require('lodash')

const flow = require('lodash/fp/flow')
const reduce = require('lodash/fp/reduce')
const get = require('lodash/fp/get')

const userSchema = module.exports = mongoose.Schema({
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

userSchema.methods.createBoard = async function({rows, columns, mines}) {

    if (mines > rows * columns) {
        const error = new Error(`Not enough space for ${mines} mines in a board of ${rows}x${columns}.`)
        error.status = 400
        throw error
    }

    const emptyCells = Array.from(
        Array(rows), () => Array.from(
            Array(columns), () => ({ display: null, mine: false })
        )
    )

    const cells = flow(
        range,
        reduce(({ posibilities, positions }) => {
            const position = sample(posibilities)
            return {
                positions: [...positions, position],
                posibilities: without(posibilities, position),
            }
        }, {
            posibilities: range(rows * columns),
            positions: [],
        }),
        get('positions'),
        reduce((cells, position, index, array) => {
            cells[floor(position / columns)][position % columns].mine = true
            return cells
        }, emptyCells)
    )(mines)

    this.boards.push({
        started: new Date(),
        time: 0,
        cells,
    })

    await this.save()

    return this.boards.length

}

userSchema.methods.getBoard = function(boardId) {
    const board = this.boards[boardId]
    if (!board) {
        const error = new Error(`The user ${this.username} does not have a board ${boardId}.`)
        error.status = 404
        throw error
    }
    return board
}

userSchema.methods.getCell = function({ boardId, row, column }) {
    const board = this.getBoard(boardId)
    const cells = board.cells[row]
    if (!cells) {
        const error = new Error(`The row ${row} is outside the board.`)
        error.status = 404
        throw error
    }
    const cell = cells[column]
    if (!cell) {
        const error = new Error(`The column ${column} is outside the board.`)
        error.status = 404
        throw error
    }
    return cell
}

userSchema.methods.resumeBoard = async function({ boardId }) {
    const board = this.getBoard(boardId)
    if (board.preserved) {
        board.started = new Date()
        board.preserved = null
        await this.save()
    }
}

userSchema.methods.preserveBoard = async function({ boardId }) {
    const board = this.getBoard(boardId)
    if (!board.preserved) {
        board.preserved = new Date()
        board.time += floor((board.preserved - board.started) / 1000)
        await this.save()
    }
}

userSchema.methods.setCellDisplay = async function({ boardId, row, column, display }) {
    const cell = this.getCell({ boardId, row, column, display })
    cell.display = display
    const board = cell.parent()
    board.cells[row].splice(0, board.cells[row].length, ...board.cells[row])
    await this.save()
}

userSchema.methods.revealCell = async function({ boardId, row, column }) {
    const cell = this.getCell({ boardId, row, column })
    return this.setCellDisplay({ boardId, row, column, display: cell.mine ? '*' : '' })
}

userSchema.methods.questionMarkCell = async function({ boardId, row, column }) {
    return this.setCellDisplay({ boardId, row, column, display: '?' })
}

userSchema.methods.flagCell = async function({ boardId, row, column }) {
    return this.setCellDisplay({ boardId, row, column, display: 'f' })
}
