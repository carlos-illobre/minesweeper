const { Router } = require('express')
const validate = require('express-validation')
const Joi = require('joi')

module.exports = Router({mergeParams: true})
.post('/v1/users/:username/boards', validate({
    body: {
        rows: Joi.number().min(0).required(),
        columns: Joi.number().min(0).required(),
        mines: Joi.number().min(0).required(),
    },
}), async (req, res, next) => {

    try {

        const user = await req.db.User.findOne({ username: req.params.username })
            || await req.db.User.create({ username: req.params.username })

        const boardId = await user.createBoard(req.body)

        res.setHeader('Location', `${req.base}${req.originalUrl}/${boardId}`)

        res.sendStatus(201)

    } catch(error) {
        next(error)
    }

})
