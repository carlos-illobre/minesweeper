const { Router } = require('express')

module.exports = Router({mergeParams: true})
.get('/v1/users/:username', async (req, res, next) => {

    try {

        const [user] = await req.db.User.find({ username: req.params.username })

        if (!user) {
            const error = new Error(`User ${req.params.username} not found.`)
            error.status = 404
            throw error
        }

        res.send(user.toJson())

    } catch(error) {
        next(error)
    }

})
