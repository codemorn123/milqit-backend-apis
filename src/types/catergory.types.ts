
export interface CreateCategoryRequest {
    name: string;
    description: string;
    slug: string;
    isActive: boolean;
    image?: string;
    icon?: string;
    banner?:string;
  }