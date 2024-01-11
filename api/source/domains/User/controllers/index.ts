import { User } from '@prisma/client';
import UserService from '../services/UserService';
import { Router, Request, Response, NextFunction } from 'express';
import { Role } from '../../../../utils/Role'
import { statusCodes } from  '../../../../utils/statusCodes'
import { checkRole } from '../../../middlewares/checkRole';


const router = Router();

router.post('/create', checkRole(Role.ADM), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.createUser(req.body);
            res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/get', checkRole(Role.ADM), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getUsers();
        res.status(statusCodes.SUCCESS).json(users);
    } catch (error) {
        next(error);
    }
});

router.get('get/email/:email', checkRole(Role.ADM), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserbyEmail(req.params.email);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/get/id/:id', checkRole(Role.ADM), async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await UserService.getUserbyId(Number(req.params.idUser));
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/get/phone/:phone', checkRole(Role.ADM), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserbyPhoneNumber(req.params.phoneNumber);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.put('/update/:id', checkRole(Role.ADM), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { idUser, name, email, photo, password, role, phoneNumber, birth } = req.body;

        if (idUser === undefined) {
            res.status(statusCodes.BAD_REQUEST).json({ error: 'User not found' });
            return;
        }

        await UserService.updateUser(idUser, {idUser, name, email, photo, password, role, phoneNumber, birth });

        res.status(statusCodes.SUCCESS).json({
            idUser,
            name,
            email,
            photo,
            password,
            role,
            phoneNumber,
            birth,
        });
    } catch (error) {
        next(error);
    }
});

router.delete('delete/email/:email', checkRole(Role.ADM), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.deleteUserbyEmail(req.params.email);
        res.status(statusCodes.SUCCESS).json('Usuário deletado com sucesso!');
    } catch (error) {
        next(error);
    }
});

router.delete('delete/id/:id', checkRole(Role.ADM), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.deleteUserbyId(Number(req.params.idUser));
        res.status(statusCodes.SUCCESS).json('Usuário deletado com sucesso!');
    } catch (error) {
        next(error);
    }
});

router.put('/approve/:id', checkRole(Role.ADM), checkRole(Role.ADM), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UserService.approveUser(Number(req.params.id));
        
        res.status(statusCodes.SUCCESS).json('Usuário aprovado com sucesso!');
    } catch (error) {
        next(error);
    }
});

export default router;

