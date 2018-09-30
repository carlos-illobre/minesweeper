const mongoose = require('mongoose')
const { pick, range } = require('lodash')

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

userSchema.methods.resumeBoard = async function({ boardId }) {

    const board = this.boards[boardId]

    if (!board) {
        const error = new Error(`The user ${this.username} does not have a board ${boardId}.`)
        error.status = 404
        throw error
    }

    if (board.preserved) {
        board.started = new Date()
        board.preserved = null
        await this.save()
    }

}

userSchema.methods.preserveBoard = async function({ boardId }) {

    const board = this.boards[boardId]

    if (!board) {
        const error = new Error(`The user ${this.username} does not have a board ${boardId}.`)
        error.status = 404
        throw error
    }

    if (!board.preserved) {
        board.preserved = new Date()
        board.time += Math.floor((board.preserved - board.started) / 1000)
        await this.save()
    }

}

userSchema.methods.revealCell = async function({ boardId, row, column }) {

    const board = this.boards[boardId]

    if (!board) {
        const error = new Error(`The user ${this.username} does not have a board ${boardId}.`)
        error.status = 404
        throw error
    }

    const row2 = board.cells[row]

    if (!row2) {
        const error = new Error(`The row ${row} is outside the board.`)
        error.status = 404
        throw error
    }

    const cell = row2[column]
    
    if (!cell) {
        const error = new Error(`The column ${column} is outside the board.`)
        error.status = 404
        throw error
    }

    cell.display = cell.mine ? '*' : ''

    board.cells[row].splice(0, board.cells[row].length, ...board.cells[row])

    await this.save()

}

userSchema.methods.questionMarkCell = async function({ boardId, row, column }) {

    const board = this.boards[boardId]

    if (!board) {
        const error = new Error(`The user ${this.username} does not have a board ${boardId}.`)
        error.status = 404
        throw error
    }

    const row2 = board.cells[row]

    if (!row2) {
        const error = new Error(`The row ${row} is outside the board.`)
        error.status = 404
        throw error
    }

    const cell = row2[column]
    
    if (!cell) {
        const error = new Error(`The column ${column} is outside the board.`)
        error.status = 404
        throw error
    }

    cell.display = '?'

    board.cells[row].splice(0, board.cells[row].length, ...board.cells[row])

    await this.save()

}

userSchema.methods.flagCell = async function({ boardId, row, column }) {

    const board = this.boards[boardId]

    if (!board) {
        const error = new Error(`The user ${this.username} does not have a board ${boardId}.`)
        error.status = 404
        throw error
    }

    const row2 = board.cells[row]

    if (!row2) {
        const error = new Error(`The row ${row} is outside the board.`)
        error.status = 404
        throw error
    }

    const cell = row2[column]
    
    if (!cell) {
        const error = new Error(`The column ${column} is outside the board.`)
        error.status = 404
        throw error
    }

    cell.display = 'f'

    board.cells[row].splice(0, board.cells[row].length, ...board.cells[row])

    await this.save()

}
