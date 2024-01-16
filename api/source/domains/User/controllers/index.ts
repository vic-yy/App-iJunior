import { User } from '@prisma/client';
import UserService from '../services/UserService';
import { Router, Request, Response, NextFunction } from 'express';
import { Role } from '../../../../utils/Role'
import { statusCodes } from  '../../../../utils/statusCodes'
import { checkRole } from '../../../middlewares/checkRole';


const router = Router();

router.post('/create', checkRole([Role.ADM]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.createUser(req.body);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/get', checkRole([Role.ADM, Role.MEMBRO]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getUsers();
        res.status(statusCodes.SUCCESS).json(users);
    } catch (error) {
        next(error);
    }
});

router.get('/get/email/:email', checkRole([Role.ADM, Role.MEMBRO]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserbyEmail(req.params.email);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/get/id/:id', checkRole([Role.ADM, Role.MEMBRO]), async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await UserService.getUserbyId(req.params.id);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/get/phone/:phone', checkRole([Role.ADM, Role.MEMBRO]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserbyPhoneNumber(req.params.phoneNumber);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.put('/update/:id', checkRole([Role.ADM, Role.MEMBRO, Role.TRAINEE]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (id === undefined) {
            res.status(statusCodes.BAD_REQUEST).json({ error: 'User not found' });
            return;
        }

        await UserService.updateUser(id, req.body);

        res.status(statusCodes.SUCCESS).json("Usuário editado com sucesso!");
    } catch (error) {
        next(error);
    }
});

router.put('/update/role/:id', checkRole([Role.ADM]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (id === undefined) {
            res.status(statusCodes.BAD_REQUEST).json({ error: 'User not found' });
            return;
        }

        await UserService.updateRole(id, req.body.role);

        res.status(statusCodes.SUCCESS).json("Cargo do usuário editado com sucesso!");
    } catch (error) {
        next(error);
    }
});

router.delete('/delete/email/:email', checkRole([Role.ADM]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.deleteUserbyEmail(req.params.email);
        res.status(statusCodes.SUCCESS).json('Usuário deletado com sucesso!');
    } catch (error) {
        next(error);
    }
});

router.delete('/delete/id/:id', checkRole([Role.ADM]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.deleteUserbyId(req.params.id);
        res.status(statusCodes.SUCCESS).json('Usuário deletado com sucesso!');
    } catch (error) {
        next(error);
    }
});

export default router;

