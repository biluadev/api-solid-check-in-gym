import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to refresh a token', async () => {
        await request(app.server).post('/users').send({
            name: 'John Doe',
            email: 'johndoe@exemplo.com',
            password: '123456'
        })

        const authResponse = await request(app.server).post('/sessions').send({
            email: 'johndoe@exemplo.com',
            password: '123456'
        })

        const cookies = authResponse.get('Set-Cookie')

        // expect(cookies).toBeDefined()

        const response = await request(app.server)
            .patch('/token/refresh')
            .set('Cookie', cookies as string[])
            .send()

        expect(authResponse.statusCode).toEqual(200)
        expect(authResponse.body).toEqual({
            token: expect.any(String),
        })
        expect(response.get('Set-Cookie')).toEqual([
            expect.stringContaining('refreshToken='),
        ])
    })
})