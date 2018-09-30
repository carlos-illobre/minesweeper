const { expect } = require('chai')
const createTestApp = require(`${process.cwd()}/test/createTestApp.js`)

describe('PUT /v1/users/{username}/boards/{boardId}/cells/{row}/{column}/flag', () => {

    let testApp

    beforeEach(async function() {
        testApp = await createTestApp()
    })

    it('returns 200 and the board with a flag in the cell', async () => {

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
                        display: null,
                        mine: false,
                    }], [{
                        display: '?',
                        mine: false,
                    }, {
                        display: 'f',
                        mine: true,
                    }],
                ],
            }],
        }

        await testApp.db.User.create(user)

        const row = 0
        const column = 1

        const { body } = await testApp
        .put(`/rest/v1/users/${user.username}/boards/0/cells/${row}/${column}/flag`)
        .expect(200)

        const expected = {
            ...user,
            boards: user.boards.map(board => ({
                ...board,
                started: board.started.toISOString(),
                cells: board.cells.map(row => row.map(({ display }) => ({ display }))),
            })),
        }

        expected.boards[0].cells[row][column].display = 'f'

        expect(body).to.deep.equal(expected)

    })

    it('returns 404 if the cell is outside the board', async () => {

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

        const row = 0
        const column = 30

        await testApp
        .put(`/rest/v1/users/${user.username}/boards/0/cells/${row}/${column}/flag`)
        .expect(404, `The column ${column} is outside the board.`)

    })

    it('returns 404 if the row is lower than zero', async () => {

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

        const row = -1
        const column = 0

        await testApp
        .put(`/rest/v1/users/${user.username}/boards/0/cells/${row}/${column}/flag`)
        .expect(404, 'The row -1 is outside the board.')

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

        const row = 0
        const column = 0
        const boardId = 10

        await testApp
        .put(`/rest/v1/users/${user.username}/boards/${boardId}/cells/${row}/${column}/flag`)
        .expect(404, `The user ${user.username} does not have a board ${boardId}.`)

    })

    it('returns 404 if the user does not exist', async () => {

        const username = 'some user'
        const row = 0
        const column = 30

        await testApp
        .put(`/rest/v1/users/${username}/boards/10/cells/${row}/${column}/flag`)
        .expect(404, `User ${username} not found.`)

    })

})
