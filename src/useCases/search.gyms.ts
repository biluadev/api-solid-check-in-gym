import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gym.repository";

interface SearchGymUseCaseParams {
    query: string
    page: number
}

interface SearchGymUseCaseResponse {
    gyms: Gym[]
}

export class SearchGymUseCase {
    constructor(private gymsRepository: GymsRepository) { }

    async execute({
        query,
        page
    }: SearchGymUseCaseParams): Promise<SearchGymUseCaseResponse> {
        const gyms = await this.gymsRepository.searchMany(query, page)
        
        return {
            gyms,
        }
    }
}