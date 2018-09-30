const { Router } = require('express')

module.exports = Router({mergeParams: true})
.put('/v1/users/:username/boards/:boardId/cells/:row/:column/questionmark', async (req, res, next) => {

    try {

        const user = await req.db.User.findOne({ username: req.params.username })

        if (!user) {
            const error = new Error(`User ${req.params.username} not found.`)
            error.status = 404
            throw error
        }

        await user.questionMarkCell(req.params)

        res.json(user.toJson())

    } catch(error) {
        next(error)
    }

})
