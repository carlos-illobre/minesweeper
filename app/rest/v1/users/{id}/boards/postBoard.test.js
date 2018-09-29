const createTestApp = require(`${process.cwd()}/test/createTestApp.js`)

describe('POST board', () => {

    let testApp

    beforeEach(async function() {
        testApp = await createTestApp()
    })

    it('returns 201 adds a board to an existent user', async () => {

        const existentUser = {
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

        await testApp.db.User.create(existentUser)

        const rows = 2
        const columns = 3
        const mines = 5

        const { header, request } = await testApp
        .post(`/rest/v1/users/${existentUser.username}/boards`)
        .send({ rows, columns, mines })
        .expect(201)

        const boardId = header.location.split('/').pop()
        expect(header.location).toBe(encodeURI(`${request.url}/${boardId}`))

        const [user] = await testApp.db.User.find({ username: existentUser.username })

        expect(user).toBeTruthy()
        expect(user.boards).toHaveLength(existentUser.boards.length + 1)
        expect(user.boards[existentUser.boards.length].started).toBeTruthy()
        expect(user.boards[existentUser.boards.length].time).toBeGreaterThanOrEqual(0)
        expect(user.boards[existentUser.boards.length].cells).toHaveLength(rows)
        user.boards[existentUser.boards.length].cells.map(row => {
            expect(row).toHaveLength(columns)
            /*const countMines =*/ row.reduce((countMines, cell) => {
                expect(cell.display).toBeNull()
                return countMines + (cell.mine ? 1 : 0)
            }, 0)
            //            expect(countMines).toBe(mines)
        })

    })

    it('returns 201 and create the user and the board if the user does not exist', async () => {

        const username = 'some user'
        const rows = 2
        const columns = 3
        const mines = 5

        const { header, request } = await testApp
        .post(`/rest/v1/users/${username}/boards`)
        .send({ rows, columns, mines })
        .expect(201)

        const boardId = header.location.split('/').pop()
        expect(header.location).toBe(encodeURI(`${request.url}/${boardId}`))

        const [user] = await testApp.db.User.find({ username })

        expect(user).toBeTruthy()
        expect(user.boards).toHaveLength(1)
        expect(user.boards[0].started).toBeTruthy()
        expect(user.boards[0].time).toBeGreaterThanOrEqual(0)
        expect(user.boards[0].cells).toHaveLength(rows)
        user.boards[0].cells.map(row => {
            expect(row).toHaveLength(columns)
            /*const countMines =*/ row.reduce((countMines, cell) => {
                expect(cell.display).toBeNull()
                return countMines + (cell.mine ? 1 : 0)
            }, 0)
            //expect(countMines).toBe(mines)
        })

    })

    it('returns 400 if the mines are greather than rows x columns', async () => {

        const username = 'some user'
        const rows = 2
        const columns = 2
        const mines = 5

        await testApp
        .post(`/rest/v1/users/${username}/boards`)
        .send({
            rows,
            columns,
            mines,
        })
        .expect(400, `Not enough space for ${mines} mines in a board of ${rows}x${columns}.`)

    })

    it('returns 400 if the mines are lower than zero', async () => {

        const username = 'some user'

        await testApp
        .post(`/rest/v1/users/${username}/boards`)
        .send({
            rows: 2,
            columns: 2,
            mines: -2,
        })
        .expect(400, {
            'status':400,
            'statusText':'Bad Request',
            'errors':[{
                'field':['mines'],
                'location':'body',
                'messages':[
                    '"mines" must be larger than or equal to 0',
                ],
                'types':[
                    'number.min',
                ],
            }],
        })

    })

})
