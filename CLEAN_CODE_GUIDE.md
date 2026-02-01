# Clean Code Best Practices Guide

## Quick Reference for Type-Safe Development

### ✅ DO: Use Proper Return Types

**Good:**
```typescript
async getUser(id: string): Promise<IUserDocument> {
    const user = await UserModel.findById(id);
    return user;
}

async getStats(): Promise<StatsResponse> {
    return {
        totalUsers: 100,
        activeUsers: 80
    };
}
```

**Bad:**
```typescript
async getUser(id: string): Promise<any> {  // ❌ Never use Promise<any>
    const user = await UserModel.findById(id);
    return user;
}
```

### ✅ DO: Use QueryBuilder for Pagination

**Good:**
```typescript
async getProducts(options: IFilter): Promise<PaginatedResponse<IProductDocument>> {
    const builder = new QueryBuilder<IProductDocument>(ProductModel, options);
    builder.filter(['name', 'description']);
    builder.addFilter({ isActive: true });
    return await builder.exec('category');  // Populate category
}
```

**Bad:**
```typescript
async getProducts(options: IFilter): Promise<any> {  // ❌ Code duplication
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;
    // ... 20+ more lines of repeated pagination logic
}
```

### ✅ DO: Use Response Builders

**Good:**
```typescript
import { createDeleteResponse, createToggleLikeResponse } from '../utils/response-builders';

async delete(id: string): Promise<DeleteResponse> {
    await ProductModel.findByIdAndDelete(id);
    return createDeleteResponse('Product');
}

async toggleLike(id: string, userId: string): Promise<ToggleLikeResponse> {
    // ... toggle logic
    return createToggleLikeResponse(liked, totalLikes, 'Product');
}
```

**Bad:**
```typescript
async delete(id: string): Promise<{ message: string; status: number }> {  // ❌ Inline object type
    await ProductModel.findByIdAndDelete(id);
    return { message: 'Deleted', status: 200 };  // ❌ Inconsistent messages
}
```

### ✅ DO: Import Proper Types from service.types

**Good:**
```typescript
import { DeleteResponse, ToggleLikeResponse, IComment } from '../types/service.types';

async deleteComment(id: string): Promise<DeleteResponse> {
    // ...
}

async addComment(content: string): Promise<ICommentDocument> {
    // ...
}
```

**Bad:**
```typescript
async deleteComment(id: string): Promise<any> {  // ❌ No type
    // ...
}
```

### ✅ DO: Use Generic Types in Services

**Good:**
```typescript
export class ProductService extends BaseService<IProductDocument> {
    constructor() {
        super(ProductModel, ['name', 'description']);  // Search fields
    }

    async create(data: Partial<IProduct>): Promise<IProductDocument> {
        return super.create(data);
    }
}
```

**Bad:**
```typescript
export class ProductService {  // ❌ No type inheritance
    async create(data: any): Promise<any> {  // ❌ No types
        return ProductModel.create(data);
    }
}
```

### ✅ DO: Use Typed Zod Validation

**Good:**
```typescript
import { validateZodSchemaMiddleware } from '../middleware/zod-validate';

@Post('create')
@Middlewares([validateZodSchemaMiddleware(createProductSchema, 'body')])
async create(@Body() body: ICreateProductInput): Promise<SuccessResponse<IProduct>> {
    // Schema validates the input automatically with types
}
```

**Bad:**
```typescript
async create(@Body() body: any): Promise<any> {  // ❌ No validation, no types
    // Manual validation code here...
}
```

## Service Pattern Examples

### Complete Service Example with Best Practices

```typescript
import { BaseService } from './base.service';
import { ProductModel, IProductDocument } from '../models/product.model';
import { IFilter, PaginatedResponse } from '../types/common.types';
import { DeleteResponse } from '../types/service.types';
import { createDeleteResponse } from '../utils/response-builders';
import { QueryBuilder } from '../utils/query-builder';
import APIError from '../error/api-error';

class ProductService extends BaseService<IProductDocument> {
    constructor() {
        super(ProductModel, ['name', 'description', 'brand']);
    }

    // ✅ Properly typed methods
    async getProducts(options: IFilter): Promise<PaginatedResponse<IProductDocument>> {
        const builder = new QueryBuilder<IProductDocument>(ProductModel, options);
        builder.filter(['name', 'description']);
        builder.addFilter({ isActive: true });
        return await builder.exec('category');
    }

    async getById(id: string): Promise<IProductDocument> {
        const product = await ProductModel.findById(id).populate('category');
        if (!product) {
            throw new APIError('Product not found', 404);
        }
        return product;
    }

    async delete(id: string): Promise<DeleteResponse> {
        const product = await this.getById(id);  // Reuse existing method
        await ProductModel.findByIdAndDelete(id);
        return createDeleteResponse('Product');
    }
}

export const productService = new ProductService();
```

## Type Definition Best Practices

### Create Reusable Interfaces

```typescript
// types/product.types.ts

export interface IProduct {
    name: string;
    description: string;
    price: number;
    category: string;
    isActive: boolean;
}

export interface IProductDocument extends IProduct, Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProductResponse {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ICategoryResponse;  // Populated
    isActive: boolean;
}

export interface ICreateProductInput {
    name: string;
    description: string;
    price: number;
    categoryId: string;
}

export interface IUpdateProductInput extends Partial<ICreateProductInput> {}
```

## Common Patterns to Avoid

### ❌ DON'T: Use `any` Type

```typescript
// Bad
async someMethod(): Promise<any> { }
function processData(data: any): any { }
const result: any = await someOperation();
```

### ❌ DON'T: Duplicate Pagination Logic

```typescript
// Bad - Repeating this in every service
const page = Number(query.page) || 1;
const limit = Number(query.limit) || 10;
const skip = (page - 1) * limit;
const docs = await Model.find().skip(skip).limit(limit);
const total = await Model.countDocuments();
// ... manual pagination response building
```

### ❌ DON'T: Have Inconsistent Response Structures

```typescript
// Bad - Different services returning different structures
return { msg: 'Deleted', code: 200 };  // Service A
return { message: 'Removed', status: 200 };  // Service B
return { success: true, data: 'Gone' };  // Service C
```

### ✅ DO: Use Consistent Response Structures

```typescript
// Good - All services use the same response builders
return createDeleteResponse('Product');
return createDeleteResponse('User');
return createDeleteResponse('Order');
```

## Quick Migration Checklist

When refactoring existing code:

- [ ] Replace all `Promise<any>` with proper return types
- [ ] Use `QueryBuilder` instead of manual pagination
- [ ] Import types from `service.types.ts`
- [ ] Use response builders from `response-builders.ts`
- [ ] Extend `BaseService<T>` for CRUD operations
- [ ] Add proper TypeScript generics where needed
- [ ] Remove duplicate code
- [ ] Add JSDoc comments for public methods
- [ ] Ensure all models have both named and default exports
- [ ] Use `timestamps: true` in Mongoose schemas instead of manual fields

## Benefits of These Patterns

✅ **Type Safety**: Catch errors at compile time, not runtime  
✅ **Code Reusability**: Write once, use everywhere  
✅ **Consistency**: Uniform patterns across the codebase  
✅ **Maintainability**: Easier to understand and modify  
✅ **IDE Support**: Better autocomplete and intellisense  
✅ **Testing**: Easier to write type-safe tests  
✅ **Onboarding**: New developers understand patterns quickly  

## Need Help?

- Check existing services for examples (e.g., `reel.service.ts`)
- Review `service.types.ts` for available types
- See `response-builders.ts` for utility functions
- Look at `QueryBuilder` for pagination patterns
