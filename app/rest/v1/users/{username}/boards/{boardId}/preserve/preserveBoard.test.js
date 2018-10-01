const { expect } = require('chai')
const createTestApp = require(`${process.cwd()}/test/createTestApp.js`)

describe('PUT /v1/users/{username}/boards/{boardId}/preserve', () => {

    let testApp

    beforeEach(async function() {
        testApp = await createTestApp()
    })

    it('returns 200 and the preserved board', async () => {

        const minutes = 1

        const started = new Date()
        started.setMinutes(started.getMinutes()-minutes)

        const user = {
            username: 'some name',
            boards: [{
                started,
                time: 0,
                cells: [
                    [{
                        display: null,
                        mine: true,
                    }, {
                        display: 'f',
                        mine: false,
                    }], [{
                        display: '',
                        mine: false,
                    }, {
                        display: null,
                        mine: true,
                    }],
                ],
            }],
        }

        await testApp.db.User.create(user)

        const { body } = await testApp
        .put(`/rest/v1/users/${user.username}/boards/0/preserve`)
        .expect(200)

        const expected = {
            ...user,
            boards: user.boards.map((board, index) => ({
                ...board,
                id: index,
                time: minutes * 60,
                started: board.started.toISOString(),
                cells: board.cells.map(row => row.map(({ display }) => ({ display }))),
                preserved: new Date().toISOString().slice(0, 19),
            })),
        }

        const actual = {
            ...body,
            boards: body.boards.map(board => ({
                ...board,
                preserved: board.preserved.slice(0, 19),
            })),
        }

        expect(actual).to.deep.equal(expected)

    })

    it('returns 200 and the preserved board if the game was already preserved', async () => {

        const minutes = 1

        const started = new Date()
        started.setMinutes(started.getMinutes()-minutes)

        const user = {
            username: 'some name',
            boards: [{
                started,
                time: 0,
                cells: [
                    [{
                        display: null,
                        mine: true,
                    }, {
                        display: 'f',
                        mine: false,
                    }], [{
                        display: '',
                        mine: false,
                    }, {
                        display: null,
                        mine: true,
                    }],
                ],
                preserved: started,
            }],
        }

        await testApp.db.User.create(user)

        const { body } = await testApp
        .put(`/rest/v1/users/${user.username}/boards/0/preserve`)
        .expect(200)

        const expected = {
            ...user,
            boards: user.boards.map((board, index) => ({
                ...board,
                id: index,
                started: board.started.toISOString(),
                cells: board.cells.map(row => row.map(({ display }) => ({ display }))),
                preserved: board.preserved.toISOString().slice(0, 19),
            })),
        }

        const actual = {
            ...body,
            boards: body.boards.map(board => ({
                ...board,
                preserved: board.preserved.slice(0, 19),
            })),
        }

        expect(actual).to.deep.equal(expected)

    })

    it('returns 404 if the board does not exist', async () => {

        const user = {
            username: 'some name',
            boards: [{
                started: new Date(),
                time: 10,
                cells: [
                    [{
                        display: null,
                        mine: true,
                    }, {
                        display: 'f',
                        mine: false,
                    }], [{
                        display: '?',
                        mine: false,
                    }, {
                        display: null,
                        mine: true,
                    }],
                ],
            }],
        }

        await testApp.db.User.create(user)

        const boardId = 10

        await testApp
        .put(`/rest/v1/users/${user.username}/boards/${boardId}/preserve`)
        .expect(404, `The user ${user.username} does not have a board ${boardId}.`)

    })

    it('returns 404 if the user does not exist', async () => {

        const username = 'some user'

        await testApp
        .put(`/rest/v1/users/${username}/boards/10/preserve`)
        .expect(404, `User ${username} not found.`)

    })

})
