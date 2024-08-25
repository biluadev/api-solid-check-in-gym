import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./searchGym.controller";
import { nearby } from "./nearGym.controller";
import { create } from "./createGym.controller";


export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.get('/gyms/search', search)
    app.get('/gyms/nearby', nearby)
    app.post('/gyms', create)
}