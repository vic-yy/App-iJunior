import { User } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}

namespace NodeJS {
    interface ProcessEnv {
        APP_URL: string,
        PORT: number,
    }
}