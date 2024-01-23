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