import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check.in";
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymRepository()
        checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository)

        await gymsRepository.create({
            id: 'gym-01',
            title: 'javaScript gym',
            description: 'gym description',
            phone: '',
            latitude: 0,
            longitude: 0,
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to check in', async () => {
        const { checkIn } = await checkInUseCase.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
        await checkInUseCase.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })

        await expect(() =>
            checkInUseCase.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: 0,
                userLongitude: 0
            }),
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should not be able to check in twice but in different day', async () => {
        vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

        await checkInUseCase.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })

        vi.setSystemTime(new Date(2024, 0, 22, 8, 0, 0))

        const { checkIn } = await checkInUseCase.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: 0,
            userLongitude: 0
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'javaScript gym',
            description: 'gym description',
            phone: '',
            latitude: new Decimal(-8.8462293),
            longitude: new Decimal(13.3261588),
        })

        await expect(() =>
            checkInUseCase.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -8.8932352,
                userLongitude: 13.254656
            }),
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })

})