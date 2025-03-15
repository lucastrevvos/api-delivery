import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { authConfigs } from '@/configs/auth'
import { AppError } from '@/utils/AppError'

interface TokenPayload {
    role: string
    sub: string
}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    try {
        const authHeader = request.headers.authorization

        if(!authHeader){
            throw new AppError("JWT token not found", 401)
        }

        const [, token] = authHeader.split(" ")

        const { role, sub: user_id } = verify(token, authConfigs.jwt.secret) as TokenPayload

        request.user = {
            id: user_id,
            role
        }

        next()

    } catch (error) {
        throw new AppError('Invalid JWT token', 401)
    }
}

export { ensureAuthenticated }