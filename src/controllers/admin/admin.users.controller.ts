import { SuccessResponse } from './../../utils/SuccessResponse';
import { IUser } from './../../models/UserModel';
import { AdminUserService } from './../../services/admin/admin.users.service';
import { errorSuccess } from '../../utils/SuccessResponse';
import { PaginatedResponse, IFilter } from '../../types/common.types';
import {
  Route,
  Tags,
  Controller,
  Delete,
  Path,
  Response,
  Security,
  Get,
  Post,
  Query,
  Middlewares,
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { idParamSchema, userIdParamSchema } from '../../constants/common.validator';


import { BaseController } from '../base.controller';

@Route("admin/users")
@Tags("Admin - Users")
@Security("jwt")
@Response(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response(StatusCodes.FORBIDDEN, 'Forbidden')
@Response(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class AdminUsersController extends BaseController {

  private adminUserService = new AdminUserService();


  @Get("/")
  @Response(StatusCodes.OK, "Users retrieved")
  public async getUsers(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() status?: 'active' | 'inactive'
  ): Promise<SuccessResponse<PaginatedResponse<IUser>>> {
    const filter: IFilter = { page, limit };
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;

    const result = await this.adminUserService.getUsersPaginated(filter);

    return this.sendPaginated(result, "Users retrieved successfully");
  }

  /**
   * Deactivates a user account (Soft Delete).
   * This action requires admin privileges.
   * @param userId The identifier of the user to be deactivated.
   */
  @Delete("/{userId}")
  @Response(StatusCodes.OK, "User deactivated")
  @Response(StatusCodes.NOT_FOUND, "User Not Found")
  @Response(StatusCodes.BAD_REQUEST, "Invalid ID")
  @Middlewares(validateSchemaMiddleware(idParamSchema, 'params'))
  public async deleteUser(@Path() userId: string): Promise<SuccessResponse<null>> {
    try {
      await this.adminUserService.deleteUser(userId);
      return this.sendResponse("User deactivated successfully");
    } catch (error: any) {
      if (error.code === 'NOT_FOUND') {
        this.setStatus(404);
        throw error;
      }
      this.setStatus(500);
      throw new Error('An unexpected error occurred while deactivating the user.');
    }
  }

  /**
   * Permanently deletes a user from the database (Hard Delete).
   * This is a destructive and irreversible action.
   * @param userId The identifier of the user to be permanently deleted.
   */
  @Delete("/{userId}/force")
  @Response(StatusCodes.OK, "User permanently deleted")
  @Response(StatusCodes.NOT_FOUND, "User Not Found")
  @Response(StatusCodes.BAD_REQUEST, "Invalid ID")
  @Middlewares(validateSchemaMiddleware(idParamSchema, 'params'))
  public async hardDeleteUser(@Path() userId: string): Promise<SuccessResponse<null>> {
    try {
      await this.adminUserService.hardDeleteUser(userId);
      return this.sendResponse("User permanently deleted successfully");
    } catch (error: any) {
      if (error.code === 'NOT_FOUND') {
        errorSuccess(error);
        throw error;
      }
      this.setStatus(500);
      throw new Error('An unexpected error occurred while permanently deleting the user.');
    }
  }

  /**
   * Retrieves a single user by their ID.
   * This action requires admin privileges.
   * @param userId The identifier of the user.
   */
  @Get("/{userId}")
  @Response(StatusCodes.OK, "User retrieved")
  @Response(StatusCodes.NOT_FOUND, "User Not Found")
  @Response(StatusCodes.BAD_REQUEST, "Invalid ID")
  @Middlewares(validateSchemaMiddleware(userIdParamSchema, 'params'))
  public async getUserById(@Path() userId: string): Promise<SuccessResponse<IUser>> {
    const user = await this.adminUserService.getUserById(userId);
    if (!user) {
      this.setStatus(404);
      throw new Error('User not found.');
    }
    return this.sendSuccess(user);
  }

  /**
   * Activate a user account (set isActive to true).
   * This allows inactive/deactivated users to access the system again.
   * @param userId The identifier of the user to activate.
   */
  @Post("/{userId}/activate")
  @Response(StatusCodes.OK, "User activated")
  @Response(StatusCodes.NOT_FOUND, "User Not Found")
  @Response(StatusCodes.BAD_REQUEST, "Invalid ID")
  @Middlewares(validateSchemaMiddleware(userIdParamSchema, 'params'))
  public async activateUser(@Path() userId: string): Promise<SuccessResponse<IUser>> {
    const user = await this.adminUserService.activateUser(userId);
    return this.sendSuccess(user, "User activated successfully");
  }

  /**
   * Deactivate a user account (set isActive to false).
   * This prevents the user from accessing the system without deleting their data.
   * @param userId The identifier of the user to deactivate.
   */
  @Post("/{userId}/deactivate")
  @Response(StatusCodes.OK, "User deactivated")
  @Response(StatusCodes.NOT_FOUND, "User Not Found")
  @Response(StatusCodes.BAD_REQUEST, "Invalid ID")
  @Middlewares(validateSchemaMiddleware(userIdParamSchema, 'params'))
  public async deactivateUser(@Path() userId: string): Promise<SuccessResponse<IUser>> {
    const user = await this.adminUserService.deactivateUser(userId);
    return this.sendSuccess(user, "User deactivated successfully");
  }
}
