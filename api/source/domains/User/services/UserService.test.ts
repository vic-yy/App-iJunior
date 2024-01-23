import UserService from "./UserService";
import { prismaMock } from '../../../../config/singleton';
import { QueryError } from "../../../../errors/QueryError";

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
        phoneNumber: "999999999",
        birth: "01/01/2024"
    }

    const returnUser = {
        id: expect.anything(),
        name: "Usuário",
        email: "teste@gmail.com",
        photo: "https://publicdomainvectors.org/photos/abstract-user-flat-4.png",
        password: expect.anything(),
        role: "administrador",
        phoneNumber: "999999999",
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
