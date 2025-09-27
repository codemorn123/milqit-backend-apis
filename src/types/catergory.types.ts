
// export interface CreateCategoryRequest {
//     name: string;
//     description: string;
//     slug: string;
//     isActive: boolean;
//     image?: string;
//     icon?: string;
//     banner?:string;
//   }


  export interface ICategoryCreateParams {
    name: string;
    parentId?: string | null; // Make it optional if it can be omitted
    backgroundColor: string;
    textColor: string;
    description: string;
    deepLink?: string;
    categoryImage?: {
      url: string;
      key: string;
    };
  
  }