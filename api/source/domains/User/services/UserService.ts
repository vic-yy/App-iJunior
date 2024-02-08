import prisma from "../../../../database/prismaClient";
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { QueryError } from "../../../../errors/QueryError";

import { transformRole } from "../../../../utils/Role";
import isEmailValid from "../../../../utils/isEmailValid";
import isURLValid from "../../../../utils/isURLValid";
import isPhoneNumberValid from "../../../../utils/isPhoneNumberValid";

class UserService {

	async encryptPassword(password: string) {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		return hash;
	}

	async createUser(body: User) {
		const userSameEmail = await prisma.user.findFirst({ where: { email: body.email } });
		const userSameNumber = await prisma.user.findFirst({ where: { phoneNumber: body.phoneNumber } });

		if (userSameEmail) {
			throw new QueryError('O e-mail já está em uso por outra conta.');
		}
		if (userSameNumber) {
			throw new QueryError('O número de telefone já está em uso por outra conta.'); 
		}

		if (body.name == null || body.name.trim() == '') {
			throw new QueryError('O nome não foi definido.');
		}
		if (body.password == null || body.password.trim() == '') {
			throw new QueryError('A senha não foi definida.');
		}
		if (body.birth == null || body.birth.trim() == '') {
			throw new QueryError('A data de nascimento não foi definida.');
		}

		if (!isEmailValid(body.email)) {
			throw new InvalidParamError('E-mail inválido.');
		}
		if (!isURLValid(body.photo)) {
			throw new InvalidParamError('Foto inválida.');
		}
		if (transformRole(body.role) == 'none') {
			throw new InvalidParamError('Função inválida. As opções são "administrador", "membro" ou "estagiário".');
		}
		if (!isPhoneNumberValid(body.phoneNumber)) {
			throw new InvalidParamError('Número de telefone inválido.');
		}

		const encrypted = await this.encryptPassword(body.password);
		const user = {
			id: uuidv4(),
			name: body.name,
			email: body.email,
			photo: body.photo,
			password: encrypted,
			role: transformRole(body.role),
			phoneNumber: body.phoneNumber,
			birth: body.birth
		}
		await prisma.user.create({ data: user });
		return (user);
	}

	async getUsers() {
		const users = await prisma.user.findMany();
		if (users.length != 0) {
			return users;
		} else {
			throw new QueryError('Nenhum usuário encontrado.');
		}
	}

	async getUserbyEmail(wantedEmail: string) {
		const user = await prisma.user.findFirst({ where: { email: wantedEmail } });
		if (user) {
			return user;
		} else {
			throw new QueryError('O e-mail não está associado a nenhuma conta.');
		}
	}

	async getUserbyId(wantedId: string) {
		const user = await prisma.user.findFirst({ where: { id: wantedId } });
		if (user) {
			return user;
		} else {
			throw new QueryError('O id não existe.');
		}
	}

	async getUserbyPhoneNumber(wantedNumber: string) {
		const user = await prisma.user.findFirst({ where: { phoneNumber: wantedNumber } });
		if (user) {
			return user;
		} else {
			throw new QueryError('O número de telefone não está associado a nenhuma conta.');
		}
	}

	async updateUser(id: string, body: User) {
		const user = await this.getUserbyId(id);
		const userSameEmail = await prisma.user.findFirst({ where: { email: body.email } });
		const userSameNumber = await prisma.user.findFirst({ where: { phoneNumber: body.phoneNumber } });

		if (userSameEmail && (user.id != userSameEmail.id)) {
			throw new QueryError('O e-mail já está em uso por outra conta.');
		}
		if (userSameNumber && (user.id != userSameNumber.id)) {
			throw new QueryError('O número de telefone já está em uso por outra conta.');
		}

		if (body.email && !isEmailValid(body.email)) {
			throw new InvalidParamError('e-mail inválido.');
		}
		if (body.photo && !isURLValid(body.photo)) {
			throw new InvalidParamError('foto inválida.');
		}

		if (body.role && (transformRole(body.role) != user.role)) {
			throw new InvalidParamError('Apenas administradores podem atualizar uma função.');
		}

		if (body.id && (body.id != user.id)) {
			throw new InvalidParamError('você não pode atualizar um id.');
		}

		if (body.name == null || body.name.trim() == '') {
			throw new QueryError('O nome não foi definido.');
		}

		if (body.birth == null || body.birth.trim() == '') {
			throw new QueryError('A data de nascimento não foi definida.');
		}

		await prisma.user.update({
			data: {
				name: body.name,
				email: body.email,
				photo: body.photo,
				phoneNumber: body.phoneNumber,
				birth: body.birth
			},
			where: {
				id: id
			}
		});
	}

	async updateRole(id: string, role: string) {
		const user = await this.getUserbyId(id);

		if (!user) {
			throw new InvalidParamError('Usuário não encontrado.');
		}

		const formattedRole = transformRole(role);

		if (formattedRole == 'none') {
			throw new InvalidParamError('função inválida. As opções são "administrador", "membro" ou "estagiário".');
		} else {
			await prisma.user.update({
				where: {
					id: id,
				},
				data: {
					role: formattedRole,
				},
			});
		}
	}

	async updatePassword(id: string, password: string){
		const user = await this.getUserbyId(id);

		if (!user) {
			throw new InvalidParamError('Usuário não encontrado.');
		}

		if (password == null || password.trim() == '') {
			throw new QueryError('A senha não foi definida.');
		}

		const encrypted = await this.encryptPassword(password);
		await prisma.user.update({
			where: {
				id: id,
			},
			data: {
				password: encrypted,
			},
		});
	}

	async deleteUserbyEmail(wantedEmail: string) {
		const user = await this.getUserbyEmail(wantedEmail);
		if (user) {
			await prisma.user.delete(({ where: { email: wantedEmail } }));
		}
	}

	async deleteUserbyId(wantedId: string) {
		const user = await this.getUserbyId(wantedId);
		if (user) {
			await prisma.user.delete(({ where: { id: wantedId } }));
		}
	}
}

export default new UserService;