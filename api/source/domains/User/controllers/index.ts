import { User } from '@prisma/client';
import UserService from '../services/UserService';
import { Router, Request, Response, NextFunction } from 'express';
import { Role } from '../../../../utils/Role'
import { statusCodes } from  '../../../../utils/statusCodes'


const router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.createUser(req.body);
            res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/allUsers', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getUsers();
        res.status(statusCodes.SUCCESS).json(users);
    } catch (error) {
        next(error);
    }
});

router.get('userByEmail', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserbyemail(req.body.email);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/userById', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserbyId(req.body.id);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/userByPhoneNumber', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserbyPhoneNumber(req.body.phoneNumber);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.put('/updateUser', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name, email, photo, password, role, phoneNumber, birth } = req.body;

        if (id === undefined) {
            res.status(statusCodes.BAD_REQUEST).json({ error: "User not found" });
            return;
        }

        await UserService.updateUser({ name, email, photo, password, role, phoneNumber, birth }, id);

        res.status(statusCodes.SUCCESS).json({
            id,
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

router.delete('deleteUserByEmail', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.deleteUserbyEmail(req.body.email);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.delete('deleteUserById', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.deleteUserbyId(req.body.id);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});


export default router;

