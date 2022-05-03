import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';

export type AbstractUser = {
	id?: string;
	name: string;
	email: string;
	password: string;
	roleId: string;
	createdAt?: Date | undefined;
}

export type CheckPasswordType = {
	enteredPassword: string;
	hashedPassword: string;
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
		const saltRounds = 12;
		const hash = await bcrypt.hash(password, saltRounds);
		return hash;
	}

	static checkPassword({ enteredPassword, hashedPassword }: CheckPasswordType): Promise<boolean> {
		const result = bcrypt.compare(enteredPassword, hashedPassword);
		return result;
	}

	get id() {
		return this._id;
	}

	get password() {
		return this._password;
	}
}

export default User;