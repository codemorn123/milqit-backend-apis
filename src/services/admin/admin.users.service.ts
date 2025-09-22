import { PresentableError } from "./../../error/clientErrorHelper";
import { IUser, UserModel } from "./../../models/UserModel";

export class AdminUserService {

  /**
   * Soft deletes a user by setting their `isActive` flag to false.
   * This is a non-destructive operation.
   * @param userId The ID of the user to deactivate.
   * @returns A boolean indicating if the operation was successful.
   */
  public async deleteUser(userId: string): Promise<boolean> {
    const user = await UserModel.findById(userId);

    if (!user) {
      // Throw a specific error that the controller can catch and turn into a 404 response.
      throw new PresentableError('NOT_FOUND', 'User not found');
    }

    // If user is already inactive, there's nothing to do.
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
  // You can add the other methods from your example (getUsers, createUser, etc.) here as well.
  // For example:
  /**
   * Updates a user's details.
   * @param userId The ID of the user to update.
   * @param updateData The data to update.
   * @returns The updated user document.
   */

  public async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    const user = await UserModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true });

    if (!user) {
      throw new PresentableError('NOT_FOUND', 'User not found');
    }
    
    return user;
  }
}
