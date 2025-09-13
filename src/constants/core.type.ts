import { Request } from 'express';
import { IUserTokenPayload } from '../services/token/token.types';
import { Permission } from '../services/permissions/permissions';
type AuthorizedRequest = Request & {
	authorizedUser: IUserTokenPayload;
	permissions: Permission[];
	timezone: string;
};

type CronJob = {
	name: string;
	isActive: boolean;
	schedule: string;
	job: () => Promise<void>;
};

export type { AuthorizedRequest, CronJob };