import { Request, Response, NextFunction } from 'express';
import statusCodes from '../../utils/statusCodes';
import { NotAuthorizedError } from '../../errors/NotAuthorizedError';

function checkRole(req: Request, res: Response, next: NextFunction, role: string) {

	const roleUser = req.user.role;
	if (roleUser === role) {
		next();
	}
	res.status(statusCodes.UNAUTHORIZED).send({ msg: 'Não autorizado' });
	throw new NotAuthorizedError('Usuário sem permissão');
}

export default checkRole;