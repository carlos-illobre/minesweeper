const { Router } = require('express')

module.exports = Router({mergeParams: true})
.delete('/v1/users/:username/boards/:boardId/cells/:row/:column/mark', async (req, res, next) => {

    try {

        const user = await req.db.User.findOne({ username: req.params.username })

        if (!user) {
            const error = new Error(`User ${req.params.username} not found.`)
            error.status = 404
            throw error
        }

        await user.deleteCellMark(req.params)

        res.json(user.boardToJson(req.params.boardId))

    } catch(error) {
        next(error)
    }

})
