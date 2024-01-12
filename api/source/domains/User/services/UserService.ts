import { prismaClient } from "../../../../database/prismaClient";
import { User } from '@prisma/client';
import Role from "../../../../utils/Role";

import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { QueryError } from "../../../../errors/QueryError";

import isEmailValid from "../../../../utils/isEmailValid";
import isURLValid from "../../../../utils/isURLValid";

const prisma = prismaClient.PrismaClient;

class UserService {

	async createUser(body: User) {
		const userSameEmail = await prisma.user.findFirst({ where: { email: body.email } });
		const userSameNumber = await prisma.user.findFirst({ where: { phoneNumber: body.phoneNumber } });

		if (userSameEmail) {
			throw new QueryError("Error: e-mail already in use.");
		}
		if (userSameNumber) {
			throw new QueryError("Error: phone number already in use.");
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
		if (body.photo != null && !isURLValid(body.photo)) {
			throw new InvalidParamError('Error: invalid photo.');
		}
		if (body.role != Role.USER && body.role != null) {
			throw new InvalidParamError('Error: invalid role. It must be user.');
		}

		const user = {
			name: body.name,
			email: body.email,
			photo: body.photo,
			password: body.password,
			role: Role.USER,
			phoneNumber: body.phoneNumber,
			birth: body.birth
		}
		await prisma.user.create({
			data: user
		});
		return (user);
	}

	async getUsers() {
		const user = await prisma.user.findMany();
		if (user) {
			return user;
		} else {
			throw new QueryError('Error: no users found.');
		}

	}

	async getUserbyemail(wantedEmail: string) {
		const user = await prisma.user.findFirst({
			where: {
				email: wantedEmail
			},
		});
		if (user) {
			return user;
		} else {
			throw new QueryError("Error: this e-mail is not associated with any account.");
		}

	}

	async getUserbyId(wantedId: number) {
		const user = await prisma.user.findFirst({
			where: {
				id: wantedId
			},
		});
		if (user) {
			return user;
		} else {
			throw new QueryError("Error: this id does not exist.");
		}
	}

	async getUserbyPhoneNumber(wantedNumber: number) {
		const user = await prisma.user.findFirst({
			where: {
				phoneNumber: wantedNumber
			},
		});
		if (user) {
			return user;
		} else {
			throw new QueryError("Error: this phone number is not associated with any account.");
		}
	}

	async updateUser(id: number, body: User) {

		const user = await this.getUserbyId(id);

		const userSameEmail = await prisma.user.findFirst({ where: { email: body.email } });
		const userSameNumber = await prisma.user.findFirst({ where: { phoneNumber: body.phoneNumber } });

		if (userSameEmail) {
			throw new QueryError("Error: e-mail already in use.");
		}
		if (userSameNumber) {
			throw new QueryError("Error: phone number already in use.");
		}

		if (body.email && !isEmailValid(body.email)) {
			throw new InvalidParamError('Error: invalid e-mail.');
		}
		if (body.photo && !isURLValid(body.photo)) {
			throw new InvalidParamError('Error: invalid photo.');
		}
		if (body.role && body.role != Role.USER) {
			throw new InvalidParamError('Error: invalid role. It must be user.');
		}

		await prisma.user.update({
			data: {
				name: body.name,
				email: body.email,
				photo: body.photo,
				password: body.password,
				role: Role.USER,
				phoneNumber: body.phoneNumber,
				birth: body.birth
			},
			where: {
				id: id
			}
		});
	}

	async deleteUserbyEmail(wantedEmail: string) {
		const user = await this.getUserbyemail(wantedEmail);
		if (user) {
			await prisma.user.delete(user);
		}
	}

	async deleteUserbyId(wantedId: number) {
		const user = await this.getUserbyId(wantedId);
		if (user) {
			await prisma.user.delete(user);
		}
	}

	async approveUser(id: number) {
		const user = await this.getUserbyId(id);
		if (user) {
			if (user.approved == false) {
				await prisma.user.update({
					where: {
						id: id,
					},
					data: {
						approved: true,
					},
				});
			} else {
				throw new QueryError("Error: this user is already approved.");
			}
		} else {
			throw new QueryError("Error: this id does not exist.");
		}
	}

}

export default new UserService;
