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
			throw new QueryError('Error: e-mail already in use by another account.');
		}
		if (userSameNumber) {
			throw new QueryError('Error: phone number already in use by another account.');
		}

		if (body.name == null || body.name.trim() == '') {
			throw new QueryError('Error: you did not define a name.');
		}
		if (body.password == null || body.password.trim() == '') {
			throw new QueryError('Error: you did not define a password.');
		}
		if (body.birth == null || body.birth.trim() == '') {
			throw new QueryError('Error: you did not define a birth date.');
		}

		if (!isEmailValid(body.email)) {
			throw new InvalidParamError('Error: invalid e-mail.');
		}
		if (!isURLValid(body.photo)) {
			throw new InvalidParamError('Error: invalid photo.');
		}
		if (transformRole(body.role) == 'none') {
			throw new InvalidParamError('Error: invalid role. It must be "administrator", "member" or "trainee".');
		}
		if (!isPhoneNumberValid(body.phoneNumber)) {
			throw new InvalidParamError('Error: invalid phone number.');
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
			throw new QueryError('Error: no users found.');
		}
	}

	async getUserbyEmail(wantedEmail: string) {
		const user = await prisma.user.findFirst({ where: { email: wantedEmail } });
		if (user) {
			return user;
		} else {
			throw new QueryError('Error: this e-mail is not associated with any account.');
		}
	}

	async getUserbyId(wantedId: string) {
		const user = await prisma.user.findFirst({ where: { id: wantedId } });
		if (user) {
			return user;
		} else {
			throw new QueryError('Error: this id does not exist.');
		}
	}

	async getUserbyPhoneNumber(wantedNumber: string) {
		const user = await prisma.user.findFirst({ where: { phoneNumber: wantedNumber } });
		if (user) {
			return user;
		} else {
			throw new QueryError('Error: this phone number is not associated with any account.');
		}
	}

	async updateUser(id: string, body: User) {
		const user = await this.getUserbyId(id);
		const userSameEmail = await prisma.user.findFirst({ where: { email: body.email } });
		const userSameNumber = await prisma.user.findFirst({ where: { phoneNumber: body.phoneNumber } });

		if (userSameEmail && (user.id != userSameEmail.id)) {
			throw new QueryError('Error: e-mail already in use by another account.');
		}
		if (userSameNumber && (user.id != userSameNumber.id)) {
			throw new QueryError('Error: phone number already in use by another account.');
		}

		if (body.email && !isEmailValid(body.email)) {
			throw new InvalidParamError('Error: invalid e-mail.');
		}
		if (body.photo && !isURLValid(body.photo)) {
			throw new InvalidParamError('Error: invalid photo.');
		}

		if (body.role && (transformRole(body.role) != user.role)) {
			throw new InvalidParamError('Error: only administrators can update a role.');
		}

		if (body.id && (body.id != user.id)) {
			throw new InvalidParamError('Error: you can not update an id.');
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
			throw new InvalidParamError(`User not found.`);
		}

		const formattedRole = transformRole(role);

		if (formattedRole == 'none') {
			throw new InvalidParamError('Error: invalid role. It must be "administrator", "member" or "trainee".');
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
			throw new InvalidParamError(`Usuário não encontrado.`);
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