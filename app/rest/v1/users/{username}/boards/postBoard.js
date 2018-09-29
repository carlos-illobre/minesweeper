const { Router } = require('express')
const { range } = require('lodash')
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

        if (req.body.mines > req.body.rows * req.body.columns) {
            const error = new Error(`Not enough space for ${req.body.mines} mines in a board of ${req.body.rows}x${req.body.columns}.`)
            error.status = 400
            throw error
        }

        let countMines = 0

        const board = {
            started: new Date(),
            time: 0,
            cells: range(req.body.rows).map(
                i => range(req.body.columns).map(
                    j => ({
                        display: null,
                        mine: req.body.mines > countMines++,
                    })
                )
            ),
        }

        const [user] = await req.db.User.find({ username: req.params.username })

        if (!user) {
            await req.db.User.create({
                username: req.params.username,
                boards: [board],
            })
            res.setHeader('Location', `${req.base}${req.originalUrl}/1`)
        } else {
            user.boards.push(board)
            await user.save()
            res.setHeader('Location', `${req.base}${req.originalUrl}/${user.boards.length}`)
        }

        res.sendStatus(201)

    } catch(error) {
        next(error)
    }

})
