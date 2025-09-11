import { Response, NextFunction } from 'express';

import { AuthorizedRequest } from '../constants/core.type';

import { PresentableError } from '@/error/clientErrorHelper';
import { Permission } from '@/services/permissions/permissions';

export const authorizePermission = (requiredPermission: Permission) => {
	return (req: AuthorizedRequest, _: Response, next: NextFunction) => {
		const user = req.authorizedUser;

		if (!user || !req.permissions.includes(requiredPermission)) {
			throw new PresentableError('UNAUTHORIZED', 'Access Denied: Insufficient Permissions');
		}

		next();
	};
};