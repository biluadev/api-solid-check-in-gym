import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./searchGym.controller";
import { nearby } from "./nearGym.controller";
import { create } from "./createGym.controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";


export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.get('/gyms/search', search)
    app.get('/gyms/nearby', nearby)
    app.post('/gyms', {onRequest: [verifyUserRole('ADMIN')]}, create)
}