// import { Category, Platform } from '../../db/models/permission';

export enum ADMIN_PERMISSIONS {
	GET_USER_BY_ID = 'GET_USER_BY_ID',
	CREATE_USER = 'CREATE_USER',
	GET_ALL_USERS = 'GET_ALL_USERS',
	VERIFY_USERS = 'VERIFY_USERS',
	REJECT_USERS = 'REJECT_USERS',
	GET_ALL_JANTRI_ADMIN = 'GET_ALL_JANTRI_ADMIN',
	CREATE_JANTRI = 'CREATE_JANTRI',
	UPDATE_JANTRI = 'UPDATE_JANTRI',
	DELETE_JANTRI = 'DELETE_JANTRI',
	SEARCH_JANTRI_ADMIN = 'SEARCH_JANTRI_ADMIN',
	GET_JANTRI_BY_ID_ADMIN = 'GET_JANTRI_BY_ID_ADMIN',
	BULK_UPLOAD_JANTRI = 'BULK_UPLOAD_JANTRI',
	EXPORT_JANTRI_EXCEL = 'EXPORT_JANTRI_EXCEL',
	CREATE_TAG = 'CREATE_TAG',
	UPDATE_TAG = 'UPDATE_TAG',
	DELETE_TAG = 'DELETE_TAG',
	GET_TAG_BY_ID = 'GET_TAG_BY_ID',
	GET_ALL_TAGS_ADMIN = 'GET_ALL_TAGS_ADMIN',
	UPLOAD_FILES_ADMIN = 'UPLOAD_FILES_ADMIN',
	GET_DASHBOARD_STATS = 'GET_DASHBOARD_STATS',

	// Remembrances
	GET_ALL_REMEMBRANCES_ADMIN = 'GET_ALL_REMEMBRANCES_ADMIN',
	GET_REMEMBRANCE_BY_ID_ADMIN = 'GET_REMEMBRANCE_BY_ID_ADMIN',
	DELETE_REMEMBRANCE_ADMIN = 'DELETE_REMEMBRANCE_ADMIN',
	GET_REMEMBRANCE_REPORTS_ADMIN = 'GET_REMEMBRANCE_REPORTS_ADMIN',
	UPDATE_REMEMBRANCE_ACTIVE_STATUS_ADMIN = 'UPDATE_REMEMBRANCE_ACTIVE_STATUS_ADMIN',
	UPDATE_REMEMBRANCE_APPROPRIATE_STATUS_ADMIN = 'UPDATE_REMEMBRANCE_APPROPRIATE_STATUS_ADMIN',
	UPDATE_REMEMBRANCE_ADMIN = 'UPDATE_REMEMBRANCE_ADMIN',

	// Posts
	VIEW_USER_POSTS = 'VIEW_USER_POSTS',
	GET_POST_ADMIN = 'GET_POST_ADMIN',
	GET_POST_REPORTS_ADMIN = 'GET_POST_REPORTS_ADMIN',
	DELETE_POST_ADMIN = 'DELETE_POST_ADMIN',
	UPDATE_POST_ACTIVE_STATUS_ADMIN = 'UPDATE_POST_ACTIVE_STATUS_ADMIN',
	UPDATE_POST_APPROPRIATE_STATUS_ADMIN = 'UPDATE_POST_APPROPRIATE_STATUS_ADMIN',

	// Reels
	VIEW_USER_REELS = 'VIEW_USER_REELS',
	GET_REEL_ADMIN = 'GET_REEL_ADMIN',
	GET_REEL_REPORTS_ADMIN = 'GET_REEL_REPORTS_ADMIN',
	DELETE_REEL_ADMIN = 'DELETE_REEL_ADMIN',
	UPDATE_REEL_ACTIVE_STATUS_ADMIN = 'UPDATE_REEL_ACTIVE_STATUS_ADMIN',
	UPDATE_REEL_APPROPRIATE_STATUS_ADMIN = 'UPDATE_REEL_APPROPRIATE_STATUS_ADMIN',

	// Feature Flags
	GET_FEATURE_FLAGS_CATEGORIES = 'GET_FEATURE_FLAGS_CATEGORIES',
	GET_FEATURE_FLAGS_FROM_CATEGORY = 'GET_FEATURE_FLAGS_FROM_CATEGORY',
	GET_FEATURE_FLAGS = 'GET_FEATURE_FLAGS',
	CREATE_FEATURE_FLAG = 'CREATE_FEATURE_FLAG',
	UPDATE_FEATURE_FLAG = 'UPDATE_FEATURE_FLAG',
	DELETE_FEATURE_FLAG = 'DELETE_FEATURE_FLAG'
}
export enum USER_PERMISSIONS {
	GET_ME = 'GET_ME',
	UPDATE_ME = 'UPDATE_ME',
	GET_JANTRI_BY_ID = 'GET_JANTRI_BY_ID',
	SEARCH_JANTRI = 'SEARCH_JANTRI',
	GET_ALL_JANTRI = 'GET_ALL_JANTRI',
	SEND_FRIEND_REQUEST = 'SEND_FRIEND_REQUEST',
	WITHDRAW_FRIEND_REQUEST = 'WITHDRAW_FRIEND_REQUEST',
	ACCEPT_FRIEND_REQUEST = 'ACCEPT_FRIEND_REQUEST',
	REJECT_FRIEND_REQUEST = 'REJECT_FRIEND_REQUEST',
	GET_FRIEND_REQUESTS = 'GET_FRIEND_REQUESTS',
	GET_SENT_FRIEND_REQUESTS = 'GET_SENT_FRIEND_REQUESTS',
	UNFRIEND = 'UNFRIEND',
	GET_FRIENDS = 'GET_FRIENDS',
	DISCOVER_PEOPLE = 'DISCOVER_PEOPLE',

	// Posts
	CREATE_POST = 'CREATE_POST',
	EDIT_POST = 'EDIT_POST',
	DELETE_POST = 'DELETE_POST',
	REPORT_POST = 'REPORT_POST',
	LIKE_POST = 'LIKE_POST',
	DISLIKE_POST = 'DISLIKE_POST',
	STAR_POST = 'STAR_POST',
	UNSTAR_POST = 'UNSTAR_POST',
	GET_POST_BY_ID = 'GET_POST_BY_ID',
	GET_POSTS = 'GET_POSTS',
	GET_STARRED_POSTS = 'GET_STARRED_POSTS',
	VIEW_POST = 'VIEW_POST',
	COMMENT_ON_POST = 'COMMENT_ON_POST',
	GET_USERS_WHO_LIKED_POST = 'GET_USERS_WHO_LIKED_POST',
	REPLY_TO_COMMENT = 'REPLY_TO_COMMENT',
	GET_COMMENTS_ON_POST = 'GET_COMMENTS_ON_POST',
	GENERATE_CAPTION = 'GENERATE_CAPTION',

	// Remembrances
	CREATE_REMEMBRANCE = 'CREATE_REMEMBRANCE',
	GET_ALL_REMEMBRANCES = 'GET_ALL_REMEMBRANCES',
	GET_REMEMBRANCE_BY_ID = 'GET_REMEMBRANCE_BY_ID',
	DELETE_REMEMBRANCE = 'DELETE_REMEMBRANCE',
	GET_COMMENTS_ON_REMEMBRANCE = 'GET_COMMENTS_ON_REMEMBRANCE',
	COMMENT_ON_REMEMBRANCE = 'COMMENT_ON_REMEMBRANCE',
	REPLY_TO_COMMENT_ON_REMEMBRANCE = 'REPLY_TO_COMMENT_ON_REMEMBRANCE',
	REPORT_REMEMBRANCE = 'REPORT_REMEMBRANCE',
	VIEW_REMEMBRANCE = 'VIEW_REMEMBRANCE',

	// Reels
	CREATE_REEL = 'CREATE_REEL',
	GET_ALL_REELS = 'GET_ALL_REELS',
	GET_REEL_BY_ID = 'GET_REEL_BY_ID',
	EDIT_REEL = 'EDIT_REEL',
	DELETE_REEL = 'DELETE_REEL',
	REPORT_REEL = 'REPORT_REEL',
	VIEW_REEL = 'VIEW_REEL',
	LIKE_REEL = 'LIKE_REEL',
	DISLIKE_REEL = 'DISLIKE_REEL',
	STAR_REEL = 'STAR_REEL',
	UNSTAR_REEL = 'UNSTAR_REEL',
	GET_STARRED_REELS = 'GET_STARRED_REELS',
	COMMENT_ON_REEL = 'COMMENT_ON_REEL',
	GET_COMMENTS_ON_REEL = 'GET_COMMENTS_ON_REEL',
	GET_USERS_WHO_LIKED_REEL = 'GET_USERS_WHO_LIKED_REEL',
	GET_MOST_VIEWED_REELS = 'GET_MOST_VIEWED_REELS',

	// Comments
	LIKE_COMMENT = 'LIKE_COMMENT',
	DISLIKE_COMMENT = 'DISLIKE_COMMENT',
	REPLIES_ON_COMMENT = 'REPLIES_ON_COMMENT',
	DELETE_COMMENT = 'DELETE_COMMENT',

	// Tags
	GET_ALL_TAGS = 'GET_ALL_TAGS',

	// Device Management
	REGISTER_DEVICE = 'REGISTER_DEVICE',
	UNREGISTER_DEVICE = 'UNREGISTER_DEVICE',

	// Notifications
	GET_NOTIFICATIONS = 'GET_NOTIFICATIONS',
	MARK_NOTIFICATION_READ = 'MARK_NOTIFICATION_READ',

	// Files
	UPLOAD_FILES = 'UPLOAD_FILES',

	// Family Tree Permissions
	GET_ALL_LABELS = 'get_all_labels',
	SEND_RELATION_REQUEST = 'send_relation_request',
	UPDATE_RELATION_REQUEST = 'update_relation_request',
	GET_FAMILY_TREE = 'get_family_tree',

	// Blocking Permissions
	BLOCK_USER = 'BLOCK_USER',
	UNBLOCK_USER = 'UNBLOCK_USER',
	GET_BLOCKED_USERS = 'GET_BLOCKED_USERS',

	// Events
	CREATE_EVENT = 'CREATE_EVENT',
	GET_EVENT_BY_ID = 'GET_EVENT_BY_ID',
	GET_EVENTS_BY_DATE = 'GET_EVENTS_BY_DATE',
	UPDATE_EVENT = 'UPDATE_EVENT',
	DELETE_EVENT = 'DELETE_EVENT'
}

//  Create a Unified Permission Type
export type Permission = ADMIN_PERMISSIONS | USER_PERMISSIONS;

// Define a Type to Ensure All Permissions are Used
type PermissionUsage = {
	permissionCode: Permission;
	description: string;
};

//  Define the Typed Config (Platforms & Categories Optional)
type EnsureAllPermissionsUsed = {
	[key in Permission]: true;
};

// // Define the Typed Config (Platforms & Categories Optional)
// type PermissionConfig = {
// 	[key in Platform]?: {
// 		[key in Category]?: PermissionUsage[];
// 	};
// };

// export const PERMISSION_CONFIG: PermissionConfig = {
// 	[Platform.Backend]: {
// 		[Category.User]: [
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_ME,
// 				description: 'See your own profile'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.UPDATE_ME,
// 				description: 'Update your own profile'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_JANTRI_BY_ID,
// 				description: 'Get a jantri by ID'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.SEARCH_JANTRI,
// 				description: 'Search jantri'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_ALL_JANTRI,
// 				description: 'Get all jantri'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.SEND_FRIEND_REQUEST,
// 				description: 'Send friend request to other users'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.WITHDRAW_FRIEND_REQUEST,
// 				description: 'Withdraw sent friend requests'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.ACCEPT_FRIEND_REQUEST,
// 				description: 'Accept received friend requests'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.REJECT_FRIEND_REQUEST,
// 				description: 'Reject received friend requests'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_FRIEND_REQUESTS,
// 				description: 'Get received friend requests'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_SENT_FRIEND_REQUESTS,
// 				description: 'Get sent friend requests'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.UNFRIEND,
// 				description: 'Unfriend a user'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_FRIENDS,
// 				description: 'Get friends'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.DISCOVER_PEOPLE,
// 				description: 'Discover people'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.CREATE_POST,
// 				description: 'Create a post'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.EDIT_POST,
// 				description: 'Edit a post'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.DELETE_POST,
// 				description: 'Delete a post'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.REPORT_POST,
// 				description: 'Report a post'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.LIKE_POST,
// 				description: 'Like a post'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.DISLIKE_POST,
// 				description: 'Dislike a post'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.STAR_POST,
// 				description: 'Star a post'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.UNSTAR_POST,
// 				description: 'Unstar a post'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_POST_BY_ID,
// 				description: 'Get a post by ID'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_POSTS,
// 				description: 'Get all posts'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_STARRED_POSTS,
// 				description: 'Get all starred posts'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.VIEW_POST,
// 				description: 'View a post'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.COMMENT_ON_POST,
// 				description: 'Comment on a post.'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_USERS_WHO_LIKED_POST,
// 				description: 'Get users who liked a post'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.REPLY_TO_COMMENT,
// 				description: 'Reply to a comment'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_COMMENTS_ON_POST,
// 				description: 'Get comments on a post'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GENERATE_CAPTION,
// 				description: 'Generate a caption'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.LIKE_COMMENT,
// 				description: 'Like a comment'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.DISLIKE_COMMENT,
// 				description: 'Dislike a comment'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.REPLIES_ON_COMMENT,
// 				description: 'Get replies on a comment'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.DELETE_COMMENT,
// 				description: 'Delete a comment'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_ALL_TAGS,
// 				description: 'Get all tags'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.CREATE_REMEMBRANCE,
// 				description: 'Create a remembrance'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_ALL_REMEMBRANCES,
// 				description: 'Get all remembrances'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_REMEMBRANCE_BY_ID,
// 				description: 'Get a remembrance by ID'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.DELETE_REMEMBRANCE,
// 				description: 'Delete a remembrance'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_COMMENTS_ON_REMEMBRANCE,
// 				description: 'Get comments on a remembrance'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.COMMENT_ON_REMEMBRANCE,
// 				description: 'Comment on a remembrance'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.REPLY_TO_COMMENT_ON_REMEMBRANCE,
// 				description: 'Reply to a comment on a remembrance'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.REPORT_REMEMBRANCE,
// 				description: 'Report a remembrance'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.VIEW_REMEMBRANCE,
// 				description: 'View a remembrance'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.CREATE_REEL,
// 				description: 'Create a reel'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_ALL_REELS,
// 				description: 'Get all reels'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_MOST_VIEWED_REELS,
// 				description: 'Get most viewed reels'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_REEL_BY_ID,
// 				description: 'Get a reel by ID'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.EDIT_REEL,
// 				description: 'Edit a reel'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.DELETE_REEL,
// 				description: 'Delete a reel'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.REPORT_REEL,
// 				description: 'Report a reel'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.VIEW_REEL,
// 				description: 'View a reel'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.LIKE_REEL,
// 				description: 'Like a reel'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.DISLIKE_REEL,
// 				description: 'Dislike a reel'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.STAR_REEL,
// 				description: 'Star a reel'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.UNSTAR_REEL,
// 				description: 'Unstar a reel'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_STARRED_REELS,
// 				description: 'Get starred reels'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.COMMENT_ON_REEL,
// 				description: 'Comment on a reel.'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_COMMENTS_ON_REEL,
// 				description: 'Get comments on a reel'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_USERS_WHO_LIKED_REEL,
// 				description: 'Get users who liked a reel'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.REGISTER_DEVICE,
// 				description: 'Register a device for push notifications'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.UNREGISTER_DEVICE,
// 				description: 'Unregister a device from push notifications'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_NOTIFICATIONS,
// 				description: 'Get user notifications'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.MARK_NOTIFICATION_READ,
// 				description: 'Mark notification as read'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.UPLOAD_FILES,
// 				description: 'Upload files'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_ALL_LABELS,
// 				description: 'Get all labels for family tree'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.SEND_RELATION_REQUEST,
// 				description: 'Send relation request'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.UPDATE_RELATION_REQUEST,
// 				description: 'Update relation request'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_FAMILY_TREE,
// 				description: 'Get family tree'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.BLOCK_USER,
// 				description: 'Block a user'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.UNBLOCK_USER,
// 				description: 'Unblock a user'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_BLOCKED_USERS,
// 				description: 'Get list of blocked users'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.CREATE_EVENT,
// 				description: 'Create an event'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_EVENT_BY_ID,
// 				description: 'Get an event by ID'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.GET_EVENTS_BY_DATE,
// 				description: 'Get events by date'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.UPDATE_EVENT,
// 				description: 'Update an event'
// 			},
// 			{
// 				permissionCode: USER_PERMISSIONS.DELETE_EVENT,
// 				description: 'Delete an event'
// 			}
// 		]
// 	},
// 	[Platform.AdminPortalBackend]: {
// 		[Category.AdminDashboard]: [
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_USER_BY_ID,
// 				description: 'Get user by ID'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_ALL_USERS,
// 				description: 'Get all users'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.VERIFY_USERS,
// 				description: 'Verify new users'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.REJECT_USERS,
// 				description: 'Reject new users'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_ALL_JANTRI_ADMIN,
// 				description: 'Get all jantri'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.CREATE_JANTRI,
// 				description: 'Create a new jantri'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.UPDATE_JANTRI,
// 				description: 'Update a jantri'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.DELETE_JANTRI,
// 				description: 'Delete a jantri'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.SEARCH_JANTRI_ADMIN,
// 				description: 'Search jantri'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_JANTRI_BY_ID_ADMIN,
// 				description: 'Get jantri by ID'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.BULK_UPLOAD_JANTRI,
// 				description: 'Bulk upload jantri'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.EXPORT_JANTRI_EXCEL,
// 				description: 'Export jantri to excel'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.CREATE_TAG,
// 				description: 'Create a post tag'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.UPDATE_TAG,
// 				description: 'Update a post tag'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.DELETE_TAG,
// 				description: 'Delete a post tag'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_TAG_BY_ID,
// 				description: 'Get a post tag by ID'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_ALL_TAGS_ADMIN,
// 				description: 'Get all post tags'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_ALL_REMEMBRANCES_ADMIN,
// 				description: 'Get all remembrances'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_REMEMBRANCE_BY_ID_ADMIN,
// 				description: 'Get a remembrance by ID'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.DELETE_REMEMBRANCE_ADMIN,
// 				description: 'Delete a remembrance'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_REMEMBRANCE_REPORTS_ADMIN,
// 				description: 'Get remembrance reports'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.VIEW_USER_POSTS,
// 				description: 'View user posts'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.VIEW_USER_REELS,
// 				description: 'View user reels'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_POST_ADMIN,
// 				description: 'Get a post by ID'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_POST_REPORTS_ADMIN,
// 				description: 'Get post reports'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_REEL_ADMIN,
// 				description: 'Get a reel by ID'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_REEL_REPORTS_ADMIN,
// 				description: 'Get reel reports'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.DELETE_REEL_ADMIN,
// 				description: 'Delete a reel'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.DELETE_POST_ADMIN,
// 				description: 'Delete a post'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.UPDATE_REMEMBRANCE_ACTIVE_STATUS_ADMIN,
// 				description: 'Update a remembrance active status'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.UPDATE_REMEMBRANCE_APPROPRIATE_STATUS_ADMIN,
// 				description: 'Update a remembrance appropriate status'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.UPDATE_POST_ACTIVE_STATUS_ADMIN,
// 				description: 'Update a post active status'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.UPDATE_POST_APPROPRIATE_STATUS_ADMIN,
// 				description: 'Update a post appropriate status'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.UPDATE_REEL_ACTIVE_STATUS_ADMIN,
// 				description: 'Update a reel active status'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.UPDATE_REEL_APPROPRIATE_STATUS_ADMIN,
// 				description: 'Update a reel appropriate status'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.UPDATE_REMEMBRANCE_ADMIN,
// 				description: 'Update a remembrance'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.UPLOAD_FILES_ADMIN,
// 				description: 'Upload files'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.CREATE_USER,
// 				description: 'creating a new user'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_DASHBOARD_STATS,
// 				description: 'Get dashboard stats'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_FEATURE_FLAGS_CATEGORIES,
// 				description: 'Get feature flag categories'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_FEATURE_FLAGS_FROM_CATEGORY,
// 				description: 'Get feature flags from category'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.GET_FEATURE_FLAGS,
// 				description: 'Get all feature flags'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.CREATE_FEATURE_FLAG,
// 				description: 'Create a feature flag'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.UPDATE_FEATURE_FLAG,
// 				description: 'Update a feature flag'
// 			},
// 			{
// 				permissionCode: ADMIN_PERMISSIONS.DELETE_FEATURE_FLAG,
// 				description: 'Delete a feature flag'
// 			}
// 		]
// 	}
// };

//  Ensure All Permissions are Used
// const usedPermissions: EnsureAllPermissionsUsed = Object.values(PERMISSION_CONFIG)
// 	.flatMap((category) => Object.values(category ?? {}))
// 	.flatMap((permissions) => permissions)
// 	.reduce((acc, { permissionCode }) => {
// 		acc[permissionCode] = true;
// 		return acc;
// 	}, {} as EnsureAllPermissionsUsed);

// //  Ensure No Missing Permissions at Compile-Time
// const allPermissions: EnsureAllPermissionsUsed = Object.assign(
// 	{},
// 	...Object.values(ADMIN_PERMISSIONS).map((p) => ({ [p]: true })),
// 	...Object.values(USER_PERMISSIONS).map((p) => ({ [p]: true }))
// );

// const missingPermissions = Object.keys(allPermissions).filter((p) => !usedPermissions[p as Permission]);

// if (missingPermissions.length > 0) {
// 	throw new Error(`Missing permissions in PERMISSION_CONFIG: ${missingPermissions.join(', ')}`);
// }