// import { Gender, LoginSource, UserStatus, Phone } from './../../models/UserModel';
import { RoleName } from './../../models/role';

export enum TokenType {
	ACCESS = 'access',
	REFRESH = 'refresh'
}

export interface IUserTokenPayload {
	id: string;
	email: string;
	phone: string;
	firstName: string;
	lastName: string;
	dob: Date;
	kpDirectory: boolean;
	profileImage: string;
	roleNames: RoleName[];
	
}

export interface IAdminTokenPayload {
	id: string;
	email: string;
	firstName: string;
	roleNames: RoleName[];
}