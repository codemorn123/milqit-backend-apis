import { success, SuccessResponse } from './../../utils/SuccessResponse';
import { IUser } from './../../models/UserModel';
import { AdminUserService } from  './../../services/admin/admin.users.service';
import { errorSuccess } from '../../utils/SuccessResponse';
import {
    Route,
    Tags,
    Controller,
    Delete,
    Path,
    Response,
    Security,
    Get,
    Query,
    NoSecurity,
  } from 'tsoa';

  
  @Route("admin/users")
  @Tags("Admin - Users")
@NoSecurity()
//   @Security("jwt") // Assumes you have a JWT security definition in tsoa.json
  export class AdminUsersController extends Controller {
    
    private adminUserService = new AdminUserService();
  

    @Get("/")
    // @SuccessResponse("200", "Users retrieved")
    public async getUsers(
      @Query() status?: 'active' | 'inactive'
    ): Promise<IUser[]> {
      if (status === 'active') {
        return this.adminUserService.getAllActiveUsers();
      }
      if (status === 'inactive') {
        return this.adminUserService.getAllInactiveUsers();
      }
      return this.adminUserService.getAllUsers();
    }
  
    /**
     * Deactivates a user account (Soft Delete).
     * This action requires admin privileges.
     * @param userId The identifier of the user to be deactivated.
     */
    @Delete("/{userId}")
    // @SuccessResponse("200", "User deactivated")
    @Response(404, "User Not Found")
    public async deleteUser(@Path() userId: string): Promise<SuccessResponse<{}>> {
      try {
        await this.adminUserService.deleteUser(userId);
        return success({}, "User deactivated successfully");
        // return { success: true, message: "User deactivated successfully" };
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
    // @SuccessResponse("200", "User permanently deleted")
    @Response(404, "User Not Found")
    public async hardDeleteUser(@Path() userId: string): Promise<{ success: boolean; message: string }> {
      try {
        await this.adminUserService.hardDeleteUser(userId);
        return { success: true, message: "User permanently deleted successfully" };
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
    @Response(404, "User Not Found")
    public async getUserById(@Path() userId: string): Promise<IUser> {
      const user = await this.adminUserService.getUserById(userId);
      if (!user) {
        this.setStatus(404);
        throw new Error('User not found');
      }
      return user;
    }
  }
  
  