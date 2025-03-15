import { env } from '../env'

export const authConfigs = {
    jwt: {
        secret: env.JWT_SECRET,
        expiresIn: "1d"
    }
}
