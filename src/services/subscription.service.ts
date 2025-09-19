import SubscriptionModel from "./../models/subscription.model";
import { ISubscription } from "./../types/subscription.types";


class SubscriptionService {
  async createSubscription(data: Partial<ISubscription>): Promise<ISubscription> {
    return await SubscriptionModel.create(data);
  }

  async getUserSubscriptions(userId: string): Promise<ISubscription[]> {
    return await SubscriptionModel.find({ userId }).exec();
  }

  async getSubscriptionById(id: string): Promise<ISubscription | null> {
    return await SubscriptionModel.findById(id).exec();
  }

  async updateSubscription(id: string, data: Partial<ISubscription>): Promise<ISubscription | null> {
    return await SubscriptionModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async cancelSubscription(id: string): Promise<ISubscription | null> {
    return await SubscriptionModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }

  async deleteSubscription(id: string): Promise<ISubscription | null> {
    return await SubscriptionModel.findByIdAndDelete(id).exec();
  }
  async getActiveSubscriptions(): Promise<ISubscription[]> {
    return await SubscriptionModel.find({ isActive: true }).exec();
  }

 async  getAllSubscriptions(): Promise<ISubscription[]> {
    return await SubscriptionModel.find().exec();
 }
}

export default new SubscriptionService();
