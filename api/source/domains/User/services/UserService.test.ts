import UserService from "./UserService";
import { User } from '@prisma/client';
import { prismaMock } from '../../../../config/singleton';
import { QueryError } from "../../../../errors/QueryError";
import e from "express";

describe('createUser', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })

    const newUser = {
        id: "1",
        name: "Usuário",
        email: "teste@gmail.com",
        photo: "https://publicdomainvectors.org/photos/abstract-user-flat-4.png",
        password: "superforte",
        role: "administrador",
        phoneNumber: "37999999999",
        birth: "01/01/2024"
    }

    const returnUser = {
        id: expect.anything(),
        name: "Usuário",
        email: "teste@gmail.com",
        photo: "https://publicdomainvectors.org/photos/abstract-user-flat-4.png",
        password: expect.anything(),
        role: "administrador",
        phoneNumber: "37999999999",
        birth: "01/01/2024"
    }

    const incompletUser = {
        id: "1",
        name: "",
        email: "teste@gmail.com",
        photo: "https://publicdomainvectors.org/photos/abstract-user-flat-4.png",
        password: "superforte",
        role: "administrador",
        phoneNumber: "37999999999",
        birth: "01/01/2024"
    }

    test('o método recebe dados do usuário ==> cadastra no banco de dados', async () => {
        prismaMock.user.create.mockResolvedValue(newUser);

        await expect(UserService.createUser(newUser)).resolves.toEqual(returnUser);
    });

    test('usuário com um email já cadastrado ==> gerar erro', async () => {
        prismaMock.user.findFirst.mockResolvedValue(newUser);

        await expect(UserService.createUser(newUser)).rejects.toThrow(new QueryError('Error: e-mail already in use by another account.'));
    });

    test('nome do usuário não definido ==> gerar erro', async () => {
        await expect(UserService.createUser(incompletUser)).rejects.toThrow(new QueryError('Error: you did not define a name.'));
    });
});

describe('getUsers', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })

    const firstUser = {
        id: "1",
        name: "Usuário 1",
        email: "1@gmail.com",
        photo: "https://publicdomainvectors.org/photos/abstract-user-flat-4.png",
        password: "superforte",
        role: "administrador",
        phoneNumber: "37111111111",
        birth: "01/01/2024"
    }

    const secondUser = {
        id: "2",
        name: "Usuário 2",
        email: "2@gmail.com",
        photo: "https://publicdomainvectors.org/photos/abstract-user-flat-4.png",
        password: "superforte",
        role: "administrador",
        phoneNumber: "37222222222",
        birth: "01/01/2024"
    }

    test('dois usuários estão cadastrados ==> retorna os dois usuários', async () => {
        prismaMock.user.findMany.mockResolvedValue([firstUser, secondUser]);

        await expect(UserService.getUsers()).resolves.toEqual([firstUser, secondUser]);
    });

    test('nenhum usuário cadastrado ==> gera erro', async () => {
        prismaMock.user.findMany.mockResolvedValue([]);

        await expect(UserService.getUsers()).rejects.toThrow(new QueryError('Error: no users found.'));
    });
});

describe('deleteById', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });

    const userId = '1';
    const userToDelete = {
        id: userId,
        name: 'Usuário',
        email: 'teste@gmail.com',
        photo: 'https://publicdomainvectors.org/photos/abstract-user-flat-4.png',
        password: 'superforte',
        role: 'administrador',
        phoneNumber: '999999999',
        birth: '01/01/2024'
    };

    test('o método recebe o id do usuário ==> deleta o usuário', async () => {
        prismaMock.user.findFirst.mockResolvedValue(userToDelete);

        await UserService.deleteUserbyId(userId);

        expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { id: userId } });
        expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
    });

    test('tenta deletar usuário inexistente ==> gera erro', async () => {
        prismaMock.user.findFirst.mockResolvedValue(null);

        await expect(UserService.deleteUserbyId(userId)).rejects.toThrow(
            new QueryError("Error: this id does not exist.")
        );

        expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { id: userId } });
        expect(prismaMock.user.delete).not.toHaveBeenCalled();
    });
});


describe('getUserByEmail', () => {
    
        beforeEach(() => {
            jest.resetAllMocks();
            jest.clearAllMocks();
        });
    
        test('o email é válido ==> retorna o usuário', async () => {
            const validEmail = 'test@exemplo.com';
            const user = {
                id: '1',
                name: 'Usuário',
                email: validEmail,
                photo: 'https://publicdomainvectors.org/photos/abstract-user-flat-4.png',
                password: 'superforte',
                role: 'administrador',
                phoneNumber: '999999999',
                birth: '01/01/2024'
            } as User;
            const findFirstSpy = jest.spyOn(prismaMock.user, 'findFirst').mockResolvedValue(user);
            const result = await UserService.getUserbyEmail(validEmail);
            
            expect(findFirstSpy).toHaveBeenCalledWith({ where: { email: user.email } });
            expect(findFirstSpy).toHaveBeenCalledTimes(1);
            expect(result).toEqual(user);
        });

        test('Email é inválido ==> lança exceção', async () => {
            const invalidEmail = 'teste@exemplo.com';
            await expect(UserService.getUserbyEmail(invalidEmail)).
            rejects.toThrow(new QueryError('Error: this e-mail is not associated with any account.'));
        });

        test('Não existe usuário com esse email ==> lança exceção', async () => {
            const invalidEmail = 'test@exemplo.com';
            await expect(UserService.getUserbyEmail(invalidEmail)).
            rejects.toThrow(new QueryError('Error: this e-mail is not associated with any account.'));
        });
    });

describe('getUserById', () => {
        
            beforeEach(() => {
                jest.resetAllMocks();
                jest.clearAllMocks();
            });
        
            test('o id é válido ==> retorna o usuário', async () => {
                const validId = '1';
                const user = {
                    id: validId,
                    name: 'Usuário',
                    email: 'exemplo@test.com',
                    photo: 'https://publicdomainvectors.org/photos/abstract-user-flat-4.png',
                    password: 'superforte',
                    role: 'administrador',
                    phoneNumber: '999999999',
                    birth: '01/01/2024'
                } as User;

                const findFirstSpy = jest.spyOn(prismaMock.user, 'findFirst').mockResolvedValue(user);
                const result = await UserService.getUserbyId(validId);

                expect(findFirstSpy).toHaveBeenCalledWith({ where: { id: user.id } });
                expect(findFirstSpy).toHaveBeenCalledTimes(1);
                expect(result).toEqual(user);
            });

            test('Não existe usuário com esse id ==> lança exceção', async () => {
                const invalidId = '1';
                await expect(UserService.getUserbyId(invalidId)).
                rejects.toThrow(new QueryError('Error: this id does not exist.'));
            });
        });

describe('getUserByPhoneNumber', () => {
                
                    beforeEach(() => {
                        jest.resetAllMocks();
                        jest.clearAllMocks();
                    });
                
                    test('o número é válido ==> retorna o usuário', async () => {
                        const validNumber = '999999999';
                        const user = {
                            id: '1',
                            name: 'Usuário',
                            email: 'exemplo@test.com',
                            photo: 'https://publicdomainvectors.org/photos/abstract-user-flat-4.png',
                            password: 'superforte',
                            role: 'administrador',
                            phoneNumber: validNumber,
                            birth: '01/01/2024'
                        } as User;
                        const findFirstSpy = jest.spyOn(prismaMock.user, 'findFirst').mockResolvedValue(user);
                        const result = await UserService.getUserbyPhoneNumber(validNumber);

                        expect(findFirstSpy).toHaveBeenCalledWith({ where: { phoneNumber: user.phoneNumber } });
                        expect(findFirstSpy).toHaveBeenCalledTimes(1);
                        expect(result).toEqual(user);
                    }
                );
                
                
                test('Número é inválido ==> lança exceção', async () => {
                    const invalidNumber = '999999999';
                    await expect(UserService.getUserbyPhoneNumber(invalidNumber)).
                    rejects.toThrow(new QueryError('Error: this phone number is not associated with any account.'));
                });

                test('Não existe usuário com esse número ==> lança exceção', async () => {
                    const invalidNumber = '999999999';
                    await expect(UserService.getUserbyPhoneNumber(invalidNumber)).
                    rejects.toThrow(new QueryError('Error: this phone number is not associated with any account.'));
                });
        });




describe('deleteByEmail', () => {

    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });

    const userEmail = 'teste@gmail.com';
    const userToDelete = {
        id: '1',
        name: 'Usuário',
        email: userEmail,
        photo: 'https://publicdomainvectors.org/photos/abstract-user-flat-4.png',
        password: 'superforte',
        role: 'administrador',
        phoneNumber: '999999999',
        birth: '01/01/2024'
    };

    test('o método recebe o email do usuário ==> deleta o usuário', async () => {
        prismaMock.user.findFirst.mockResolvedValue(userToDelete);

        await UserService.deleteUserbyEmail(userEmail);

        expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { email: userEmail } });
        expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { email: userEmail } });
    });

    test('tenta deletar usuário inexistente ==> gera erro', async () => {
        prismaMock.user.findFirst.mockResolvedValue(null);

        await expect(UserService.deleteUserbyEmail(userEmail)).rejects.toThrow(
            new QueryError("Error: this e-mail is not associated with any account.")
        );

        expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { email: userEmail } });
        expect(prismaMock.user.delete).not.toHaveBeenCalled();
    });
});
