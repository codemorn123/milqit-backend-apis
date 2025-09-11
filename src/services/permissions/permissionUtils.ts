import * as models from '../../models/permission';
// import { RoleName } from '../../db/models/role';
import { ADMIN_PERMISSIONS, USER_PERMISSIONS } from './permissions';

export const deleteAndAddPermissions = async (platforms, permissionsFromConfig) => {
	// Get all permission codes from config for comparison
	const configPermissionCodes = permissionsFromConfig.map((p) => p.permissionCode);

	// Find permissions to delete (existing permissions not in config)
	const permissionsToDelete = await models.Permission.find({
		platform: { $in: platforms },
		permissionCode: { $nin: configPermissionCodes }
	});

	// Delete related role permissions and permissions
	if (permissionsToDelete.length > 0) {
		const permissionIds = permissionsToDelete.map((p) => p._id);

		// Delete related role permissions
		await models.RolePermission.deleteMany({
			permissionId: { $in: permissionIds }
		});

		// Delete permissions
		await models.Permission.deleteMany({
			_id: { $in: permissionIds }
		});

		console.log(`🗑️  Deleted ${permissionsToDelete.length} deprecated permissions and their role associations`);
	}

	// Create/Update permissions from config
	const permissionPromises = permissionsFromConfig.map(async (permission) => {
		const createdPermission = await models.Permission.findOneAndUpdate(
			{ permissionCode: permission.permissionCode },
			{
				platform: permission.platform,
				category: permission.category,
				subCategory: '',
				description: permission.description
			},
			{ upsert: true }
		);

		// by default add rolePermission also for both role
		if (Object.values(ADMIN_PERMISSIONS).includes(permission.permissionCode)) {
			const adminRole = await models.Role.findOne({ name: RoleName.ADMIN });

			await models.RolePermission.findOneAndUpdate(
				{
					roleId: adminRole._id,
					permissionId: createdPermission._id
				},
				{ $set: { roleId: adminRole._id, permissionId: createdPermission._id } },
				{ upsert: true }
			);
		}

		if (Object.values(USER_PERMISSIONS).includes(permission.permissionCode)) {
			const userRole = await models.Role.findOne({ name: RoleName.USER });
			await models.RolePermission.findOneAndUpdate(
				{
					roleId: userRole._id,
					permissionId: createdPermission._id
				},
				{ $set: { roleId: userRole._id, permissionId: createdPermission._id } },
				{ upsert: true }
			);
		}
	});

	await Promise.all(permissionPromises);
	console.log('✅ Permissions synced successfully');
};