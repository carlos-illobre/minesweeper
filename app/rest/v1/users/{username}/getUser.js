const { Router } = require('express')
const { pick } = require('lodash')

module.exports = Router({mergeParams: true})
.get('/v1/users/:username', async (req, res, next) => {

    try {

        const [user] = await req.db.User.find({ username: req.params.username })

        if (!user) {
            const error = new Error(`User ${req.params.username} not found.`)
            error.status = 404
            throw error
        }

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
