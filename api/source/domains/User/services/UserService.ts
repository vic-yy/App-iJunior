import { prisma } from "../../../../database/prismaClient";
import { User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { QueryError } from "../../../../errors/QueryError";

import { transformRole } from "../../../../utils/Role";
import isEmailValid from "../../../../utils/isEmailValid";
import isURLValid from "../../../../utils/isURLValid";

class UserService {

	async encryptPassword(password:string) {
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
		if (body.birth == null) {
			throw new QueryError('Error: you did not define a birth date.');
		}

		if (!isEmailValid(body.email)) {
			throw new InvalidParamError('Error: invalid e-mail.');
		}
		if (body.photo != null && !isURLValid(body.photo)) {
			throw new InvalidParamError('Error: invalid photo.');
		}
		if (transformRole(body.role)=='none') {
			throw new InvalidParamError('Error: invalid role. It must be "administrator", "member" or "trainee".');
		}

		const encrypted = await this.encryptPassword(body.password);
		const user = {
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
		if (users) {
			return users;
		} else {
			throw new QueryError('Error: no users found.');
		}
	}

	async getUserbyEmail(wantedEmail: string) {
		const user = await prisma.user.findFirst({ where: { email: wantedEmail }});
		if (user) {
			return user;
		} else {
			throw new QueryError('Error: this e-mail is not associated with any account.');
		}
	}

	async getUserbyId(wantedId: number) {
		const user = await prisma.user.findFirst({ where: { id: wantedId }});
		if (user) {
			return user;
		} else {
			throw new QueryError('Error: this id does not exist.');
		}
	}

	async getUserbyPhoneNumber(wantedNumber: string) {
		const user = await prisma.user.findFirst({ where: { phoneNumber: wantedNumber }});
		if (user) {
			return user;
		} else {
			throw new QueryError('Error: this phone number is not associated with any account.');
		}
	}

	async updateUser(id: number, body: User) {
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


		let encrypted;
		if (body.password) {
			encrypted = await this.encryptPassword(body.password);
		} else {
			encrypted = user.password;
		}

		await prisma.user.update({
			data: {
				name: body.name,
				email: body.email,
				photo: body.photo,
				password: encrypted,
				role: transformRole(body.role),
				phoneNumber: body.phoneNumber,
				birth: body.birth
			},
			where: {
				id: id
			}
		});
	}

	async updateRole (id:number, role: string) {
		const user = await this.getUserbyId(id);
		const formattedRole = transformRole(role);

		if (formattedRole=='none') {
			throw new InvalidParamError('Error: invalid role. It must be "administrator", "member" or "trainee".');
		} else {
			user.role = formattedRole;
		}
	}

	async deleteUserbyEmail(wantedEmail: string) {
		const user = await this.getUserbyEmail(wantedEmail);
		if (user) {
			await prisma.user.delete(({ where: { email: wantedEmail } }));
		}
	}

	async deleteUserbyId(wantedId: number) {
		const user = await this.getUserbyId(wantedId);
		if (user) {
			await prisma.user.delete(({ where: { id: wantedId } }));
		}
	}
}

export default new UserService;