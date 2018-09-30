const { Router } = require('express')
const { pick } = require('lodash')

module.exports = Router({mergeParams: true})
.put('/v1/users/:username/boards/:boardId/:row/:column/flag', async (req, res, next) => {

    try {

        const [user] = await req.db.User.find({ username: req.params.username })

        if (!user) {
            const error = new Error(`User ${req.params.username} not found.`)
            error.status = 404
            throw error
        }

        const board = user.boards[req.params.boardId]

        if (!board) {
            const error = new Error(
                `The user ${req.params.username} does not have a board ${req.params.boardId}.`
            )
            error.status = 404
            throw error
        }

        const row = board.cells[req.params.row]

        if (!row) {
            const error = new Error(
                `The row ${req.params.row} is outside the board.`
            )
            error.status = 404
            throw error
        }

        const cell = row[req.params.column]
        
        if (!cell) {
            const error = new Error(
                `The column ${req.params.column} is outside the board.`
            )
            error.status = 404
            throw error
        }

        cell.display = 'f'

        await cell.save()

        res.send({
            username: user.username,
            boards: user.boards.map(board => ({
                ...pick(board, ['started', 'time']),
                cells: board.cells.map(
                    row => row.map(
                        cell => pick(cell, ['display'])
                    )
                ),
            })),
        })

    } catch(error) {
        next(error)
    }

})
