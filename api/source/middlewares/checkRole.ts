import { Request, Response, NextFunction } from 'express';
import statusCodes from '../../utils/statusCodes';
import { NotAuthorizedError } from '../../errors/NotAuthorizedError';
import Role from '../../utils/Role';

export function checkRole(role: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const roleUser = Role.ADM;
        if (roleUser === role) {
            next();
        }

        res.status(statusCodes.UNAUTHORIZED).send({ msg: 'Não autorizado' });
        throw new NotAuthorizedError('Usuário sem permissão');
    };
}