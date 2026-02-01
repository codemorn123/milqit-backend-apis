import { IUser, UserModel, IUserDocument } from '../../models/UserModel';
import { PaginatedResponse, PaginationQuery } from '../../types/common.types';
import { BaseService } from '../base.service';

export class AdminUserService extends BaseService<IUserDocument> {
  constructor() {
    // Provide search fields for BaseService's getAll pagination logic
    super(UserModel, ['name', 'email', 'phone']);
  }

  /**
   * Soft delete a user (set isActive to false)
   */
  public async deleteUser(userId: string): Promise<boolean> {
    const user = await this.update(userId, { isActive: false } as any);
    return !!user;
  }

  /**
   * Hard delete a user (permanently remove from DB)
   */
  public async hardDeleteUser(userId: string): Promise<boolean> {
    await super.delete(userId);
    return true;
  }

  /**
   * Get users with pagination and filtering
   */
  public async getUsersPaginated(query: PaginationQuery & { isActive?: any }): Promise<PaginatedResponse<IUserDocument>> {
    // BaseService getAll handles pagination and common filtering (search)
    // We can pass additional filters if needed
    const filter: any = {};
    if (query.isActive !== undefined) {
      // Handle both boolean and string "true"/"false" from query params
      filter.isActive = query.isActive === 'true' || query.isActive === true;
    }
    return this.getAll(query, filter);
  }

  public async getAllUsers(): Promise<IUserDocument[]> {
    return UserModel.find().lean<IUserDocument[]>();
  }

  public async getAllActiveUsers(): Promise<IUserDocument[]> {
    return UserModel.find({ isActive: true }).lean<IUserDocument[]>();
  }

  public async getAllInactiveUsers(): Promise<IUserDocument[]> {
    return UserModel.find({ isActive: false }).lean<IUserDocument[]>();
  }

  public async hardDeleteAllUsers(): Promise<boolean> {
    const deleteResult = await UserModel.deleteMany({});
    return deleteResult.deletedCount > 0;
  }

  /**
   * Update user details
   */
  public async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUserDocument> {
    return this.update(userId, updateData);
  }

  /**
   * Activate a user account
   */
  public async activateUser(userId: string): Promise<IUserDocument> {
    return this.update(userId, { isActive: true } as any);
  }

  /**
   * Deactivate a user account
   */
  public async deactivateUser(userId: string): Promise<IUserDocument> {
    return this.update(userId, { isActive: false } as any);
  }

  // Helper alias for backward compatibility or convenience
  public async getUserById(userId: string): Promise<IUserDocument> {
    return this.getOne(userId);
  }
}

export const adminUserService = new AdminUserService();
