import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search gym by title', async () => {
        const { token } = await createAndAuthenticateUser(app)
        
        await request(app.server)
            .get('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: 'Some description',
                phone: '12345667',
                latitude: 0,
                longitude: 0
            })

            await request(app.server)
            .get('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TypeScript Gym',
                description: 'Some description',
                phone: '12345667',
                latitude: 0,
                longitude: 0
            })
        
        const response = await request(app.server)
        .get('/gyms/search')
        .query({
            query: 'JavaScript',
        })
        .set('Authorization', `Bear ${token}`)
        .send()

        expect(response.statusCode).toEqual(201)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym',
            })
        ])
    })
})