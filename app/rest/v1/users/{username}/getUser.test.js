const { expect } = require('chai')
const createTestApp = require(`${process.cwd()}/test/createTestApp.js`)

describe('GET /v1/users/{username}', () => {

    let testApp

    beforeEach(async function() {
        testApp = await createTestApp()
    })

    it('return 200 and the user with the preserved boards when the user exists', async () => {

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
                        display: '*',
                        mine: true,
                    }],
                ],
            }, {
                started: new Date(),
                time: 10,
                cells: [
                    [{
                        display: 'f',
                        mine: false,
                    }, {
                        display: '',
                        mine: false,
                    }], [{
                        display: '?',
                        mine: true,
                    }, {
                        display: null,
                        mine: false,
                    }],
                ],
            }],
        }

        await testApp.db.User.create(user)

        const { body } = await testApp.get(`/rest/v1/users/${user.username}`).expect(200)

        const expected = {
            ...user,
            boards: user.boards.map((board, index) => ({
                ...board,
                id: index,
                started: board.started.toISOString(),
                cells: board.cells.map(row => row.map(({ display }) => ({ display }))),
            })),
        }

        expect(body).to.deep.equal(expected)

    })

    it('return 404 if the user does not exist', async () => {

        const username = 'some name'

        return testApp.get(`/rest/v1/users/${username}`)
        .expect(404, `User ${username} not found.`)

    })

})
