import { Request, Response } from 'express'
import { prisma } from '@/database/prisma'
import z from 'zod'
import { AppError } from '@/utils/AppError'
import { compare } from 'bcrypt'
import { authConfigs } from '@/configs/auth'
import { sign } from 'jsonwebtoken'


class SessionsController {
    async create(request: Request, response: Response ){
        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6)
        })

        const {email, password} = bodySchema.parse(request.body)

        const user = await prisma.user.findFirst({
            where: { email }
        })

        if(!user){
            throw new AppError('Invalid email or password', 401)
        }

        const passwordMatched = await compare(password, user.password)

        if(!passwordMatched){
            throw new AppError('Invalid email or password', 401)
        }

        const { secret, expiresIn } = authConfigs.jwt

        const payload = {
            role: user.role ?? 'customer'
        }

        // @ts-ignore
        const token = sign(payload, secret, { subject: user.id, expiresIn})

        const { password: hashedPassword, ...userWithoutPassword } = user

        return response.json({token, user: userWithoutPassword })
    }
}

export { SessionsController }