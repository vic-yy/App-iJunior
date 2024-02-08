import { User } from '@prisma/client';
import UserService from '../services/UserService';
import { Router, Request, Response, NextFunction } from 'express';
import { Role } from '../../../../utils/Role'
import { statusCodes } from  '../../../../utils/statusCodes'
import { checkRole } from '../../../middlewares/checkRole';
import { loginMiddleware, notLoggedInMiddleware, logoutMiddleware, verifyJWT } from '../../../middlewares/auth-middlewares';


const router = Router();

router.post('/login', notLoggedInMiddleware, loginMiddleware);
router.post('/logout', logoutMiddleware);


router.post('/create', checkRole([Role.ADM]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.createUser(req.body);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/get', verifyJWT, checkRole([Role.ADM, Role.MEMBRO]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getUsers();
        res.status(statusCodes.SUCCESS).json(users);
    } catch (error) {
        next(error);
    }
});

router.get('/get/email/:email', verifyJWT, checkRole([Role.ADM, Role.MEMBRO]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserbyEmail(req.params.email);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/get/id/:id', verifyJWT, checkRole([Role.ADM, Role.MEMBRO]), async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await UserService.getUserbyId(req.params.id);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/get/phone/:phone', verifyJWT, checkRole([Role.ADM, Role.MEMBRO]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getUserbyPhoneNumber(req.params.phoneNumber);
        res.status(statusCodes.SUCCESS).json(user);
    } catch (error) {
        next(error);
    }
});

router.put('/update/:id', verifyJWT, checkRole([Role.ADM, Role.MEMBRO, Role.TRAINEE]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        await UserService.updateUser(id, req.body);

        res.status(statusCodes.SUCCESS).json("Usuário editado com sucesso!");
    } catch (error) {
        next(error);
    }
});

router.put('/update/role/:id', verifyJWT, checkRole([Role.ADM]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        await UserService.updateRole(id, req.body.role);

        res.status(statusCodes.SUCCESS).json("Cargo do usuário editado com sucesso!");
    } catch (error) {
        next(error);
    }
});

router.put('/update/password/:id', checkRole([Role.ADM, Role.MEMBRO, Role.TRAINEE]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        await UserService.updatePassword(id, req.body.password);

        res.status(statusCodes.SUCCESS).json("Senha do usuário editada com sucesso!");
    } catch (error) {
        next(error);
    }
});

router.delete('/delete/email/:email', verifyJWT, checkRole([Role.ADM]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.deleteUserbyEmail(req.params.email);
        res.status(statusCodes.SUCCESS).json('Usuário deletado com sucesso!');
    } catch (error) {
        next(error);
    }
});

router.delete('/delete/id/:id', verifyJWT, checkRole([Role.ADM]), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.deleteUserbyId(req.params.id);
        res.status(statusCodes.SUCCESS).json('Usuário deletado com sucesso!');
    } catch (error) {
        next(error);
    }
});

export default router;

