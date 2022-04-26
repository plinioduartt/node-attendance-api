import crypto from 'node:crypto';
import bcrypt from 'bcrypt';

export type AbstractUser = {
	id?: string;
	name: string;
	email: string;
	password: string;
	roleId: string;
}

type SignInType = {
	email: string;
	password: string;
}

abstract class User {
	protected _id?: string;
	public name: string;
	public email: string;
	protected _password: string;
	public roleId: string;

	constructor({
		name,
		email,
		password,
		id,
		roleId,
	}: AbstractUser) {
		this._id = id ?? crypto.randomUUID();
		this.name = name;
		this.email = email;
		this.roleId = roleId;
		this._password = password;
	}

	static async hashPassword(password: string): Promise<string> {
		const saltRounds = 10;
		try {
			const hash = bcrypt.hash(password, saltRounds);
			return hash;
		} catch (error) {
			console.error(`An error occurred while generating hash password: `, error);
			throw new Error(`An error occurred while generating hash password: ${error}`);
		}
	}

	static async checkPassword({ email, password }: SignInType) {
		console.info(`email: ${email}`);
		console.info(`password: ${password}`);
	}

	get id() {
		return this._id;
	}

	get password() {
		return this._password;
	}
}

export default User;