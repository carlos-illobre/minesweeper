const { expect } = require('chai')
const createTestApp = require(`${process.cwd()}/test/createTestApp.js`)

describe('createExpressApp', () => {

    let testApp

    beforeEach(async function() {
        testApp = await createTestApp()
    })

    it('returns 404 and a JSON error message if the endpoint does not exist', async () => {

        const { text } = await testApp
        .get('/rest/unexisten/url')
        .expect(404)

        expect(text.startsWith('<!DOCTYPE html>')).to.be.false

    })

})
