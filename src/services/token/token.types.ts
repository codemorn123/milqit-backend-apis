

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
	roleNames: string[];
	
}

export interface IAdminTokenPayload {
	id: string;
	email: string;
	firstName: string;
	roleNames: string[];
}