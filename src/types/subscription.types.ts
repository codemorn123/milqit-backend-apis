// src/types/subscription.types.ts
export interface ISubscription {
    id: string;
    userId: string;
    productType: 'milk' | 'vegetable';
    plan: 'daily' | 'weekly' | 'monthly';
    startDate: Date; // ISO string
    endDate?: string;  // optional for open-ended
    quantity: number;
    isActive: boolean;
    productName: string;
    subscriptionType: 'milk' | 'vegetable' | 'other';
    planType: 'daily' | 'weekly' | 'monthly';
  }
  