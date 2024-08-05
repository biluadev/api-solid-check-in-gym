import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { CreateGymUseCase } from "./create.gym";
import { beforeEach, describe, expect, it } from "vitest";

let gymsRepository: InMemoryGymRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to create gym', async () => {
        const { gym } = await sut.execute({
            title: 'Javascript',
            description: null,
            phone: null,
            latitude: 0,
            longitude: 0
        })

        expect(gym.id).toEqual(expect.any(String))
    })
})