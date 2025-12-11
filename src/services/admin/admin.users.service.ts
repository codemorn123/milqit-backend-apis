import { PresentableError } from "./../../error/clientErrorHelper";
import { IUser, UserModel } from "./../../models/UserModel";

export class AdminUserService {

  public async deleteUser(userId: string): Promise<boolean> {
    const user = await UserModel.findById(userId);
    if (!user) {
      // Throw a specific error that the controller can catch and turn into a 404 response.
      throw new PresentableError('NOT_FOUND', 'User not found');
    }

    if (!user.isActive) {
      return true;
    }

    user.isActive = false;
    await user.save();

    return true;
  }

  /**
   * Retrieves a single user by their ID.
   * @param userId The ID of the user to retrieve.
   * @returns The user document or null if not found.
   */
  public async getUserById(userId: string): Promise<IUser | null> {
    return UserModel.findById(userId);
  }


  public async hardDeleteUser(userId: string): Promise<boolean> {
    const deleteResult = await UserModel.findByIdAndDelete(userId);

    if (!deleteResult) {
      // If no document was found and deleted, throw an error.
      throw new PresentableError('NOT_FOUND', 'User not found');
    }

    return true;
  }
  public async getUsersPaginated(
    page: number,
    limit: number,
    status?: 'active' | 'inactive'
  ): Promise<{ users: IUser[], total: number, page: number, limit: number, totalPages: number }> {
    const query: any = {};
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      UserModel.countDocuments(query)
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  public async getAllUsers(): Promise<IUser[]> {
    return UserModel.find();
  }

  public async getAllActiveUsers(): Promise<IUser[]> {
    return UserModel.find({ isActive: true });
  }

  public async getAllInactiveUsers(): Promise<IUser[]> {
    return UserModel.find({ isActive: false });
  }

  public async hardDeleteAllUsers(): Promise<boolean> {
    const deleteResult = await UserModel.deleteMany({});
    return deleteResult.deletedCount > 0;
  }


  public async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    const user = await UserModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
    if (!user) {
      throw new PresentableError('NOT_FOUND', 'User not found');
    }

    return user;
  }
}
