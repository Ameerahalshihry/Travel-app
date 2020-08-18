const appServer = require('../src/server/server')
const request = require('supertest')

describe("Test server side", () => {
    test("should test a GET response", async () => {
        const response  = await request(appServer).get('/')
            expect(response.statusCode).toBe(200)
    })
})
