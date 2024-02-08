import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PermissionError } from '../../errors/PermissionError';
import UserService from '../domains/User/services/UserService';
import bcrypt from 'bcrypt';
import statusCodes from '../../utils/statusCodes';


function generateJWT(user: User, res: Response){
    const body = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,

    };

    const token = jwt.sign({ user: body }, process.env.SECRET_KEY as string, 
        { expiresIn: process.env.JWT_EXPIRATION });
    
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        // Alterar depois do desenvolvimento
    });
}

function cookieExtractor(req: Request){
    let token = null;
    if (req && req.cookies){
        token = req.cookies['jwt'];
    }
    return token;
}

async function loginMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await UserService.getUserbyEmail(req.body.email);
        if(!user){
            throw new PermissionError('Email e/ou senha incorretos');
        } else {
            const matchingPassword = await bcrypt.compare(req.body.password, user.password);
            if(!matchingPassword) {
                throw new PermissionError('Email e/ou senha incorretos');
            }
        }
        
        generateJWT(user, res);

        res.status(statusCodes.SUCCESS).json('Usuário logado com sucesso');
    } catch(error){
        next(error);
    
    }
}

async function notLoggedInMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = cookieExtractor(req);

        if(token){
            throw new PermissionError('Você já está logado');
        } else{
            next();
        }
    } catch(error){
        next(error);
    }
    
}

async function logoutMiddleware(req: Request, res: Response, next: NextFunction){
    try {
        const token = cookieExtractor(req);

        if(!token){
            throw new PermissionError('Você precisa estar logado para realizar essa ação');
        }
        res.clearCookie('jwt');
        res.status(statusCodes.SUCCESS).json('Usuário deslogado com sucesso');
    }catch(error){
        next(error);
    }
    
}


function verifyJWT(req: Request, res: Response, next: NextFunction){
    try {
        const token = cookieExtractor(req);
        if(token){
            const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;
            req.user = decoded.user;
        }if(!req.user){
            throw new PermissionError(
                'Você precisa estar logado para realizar essa ação!');
        }
        next();

    }catch(error){
        next(error);
    }
}

export { loginMiddleware, notLoggedInMiddleware, logoutMiddleware, verifyJWT };