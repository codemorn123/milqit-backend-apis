# Pagination System Documentation

## Problem: mongoose-paginate-v2 Type Exports

### The Issue
The error `Module '"mongoose-paginate-v2"' has no exported member 'PaginateOptions'` occurs because:

1. **Inconsistent Type Exports**: The `mongoose-paginate-v2` library doesn't consistently export TypeScript types
2. **Version Mismatches**: The `@types/mongoose-paginate-v2` package may not match your library version perfectly
3. **Module Resolution**: TypeScript can't find the type definitions it's looking for

### The Solution

We've implemented a **custom type system** that provides better type safety and avoids dependency on the library's inconsistent type exports.

## Solution Architecture

### 1. Custom Type Definitions (`src/types/mongoose-pagination.d.ts`)
This file extends the Mongoose module with proper pagination types:

```typescript
declare module 'mongoose' {
    interface PaginateOptions {
        // All pagination options...
    }
    
    interface PaginateResult<T> {
        // Result structure...
    }
    
    interface PaginateModel<T extends Document> extends Model<T> {
        paginate(...): Promise<PaginateResult<T>>;
    }
}
```

### 2. Application Types (`src/types/pagination.types.ts`)
Our own strongly-typed interfaces:

- **`PaginatedResponse<T>`**: Clean response structure
- **`PaginationQuery`**: Query parameters from API requests
- **`PaginationOptions`**: Internal pagination configuration
- **`parsePaginationQuery()`**: Convert query params to options
- **`toPaginatedResponse()`**: Convert library result to our response

### 3. Base Service (`src/services/base.service.ts`)
Generic pagination implementation using our types:

```typescript
protected readonly model: Model<T> & {
    paginate: (query?: any, options?: PaginationOptions) => Promise<any>;
};
```

## Usage Examples

### Basic Service Implementation

```typescript
import { BaseService } from './base.service';
import { ProductDocument } from '../models/product.model';

export class ProductService extends BaseService<ProductDocument> {
    constructor() {
        super(ProductModel, ['name', 'description', 'sku']);
    }
    
    // Automatically gets getAll() with pagination
}
```

### Controller Usage

```typescript
async getAllProducts(req: Request, res: Response) {
    const result = await productService.getAll(req.query);
    // result is PaginatedResponse<ProductDocument>
    
    res.json({
        success: true,
        data: result.docs,
        pagination: {
            totalDocs: result.totalDocs,
            totalPages: result.totalPages,
            currentPage: result.page,
            hasNextPage: result.hasNextPage,
            hasPrevPage: result.hasPrevPage
        }
    });
}
```

### Advanced Filtering

```typescript
const result = await productService.getAll(
    { page: 1, limit: 20, search: 'milk' },
    { category: categoryId, inStock: true },
    { populate: ['category', 'reviews'], select: '-__v' }
);
```

## API Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 100) |
| `search` | string | - | Search term |
| `sortBy` | string | - | Field to sort by |
| `sortOrder` | 'asc'\|'desc' | 'desc' | Sort direction |
| `populate` | string | - | Relations to populate |
| `select` | string | - | Fields to include/exclude |

## Response Format

```typescript
{
    docs: T[];              // Array of documents
    totalDocs: number;      // Total matching documents
    limit: number;          // Items per page
    page: number;           // Current page
    totalPages: number;     // Total pages
    hasNextPage: boolean;   // Has next page
    hasPrevPage: boolean;   // Has previous page
    nextPage: number | null;
    prevPage: number | null;
    pagingCounter: number;  // Starting index
}
```

## Why This Approach is Better

### ✅ Advantages

1. **Type Safety**: Full TypeScript support without relying on inconsistent library exports
2. **Flexibility**: Easy to customize response format for your API
3. **Consistency**: Same pagination structure across all endpoints
4. **Clean API**: Convert library-specific formats to clean responses
5. **No Breaking Changes**: Works with existing mongoose-paginate-v2 without changes

### ❌ What We Avoid

1. **Direct Type Imports**: No need for `import { PaginateOptions } from 'mongoose-paginate-v2'`
2. **Version Dependencies**: Not affected by type definition version mismatches
3. **Type Casting**: Minimal use of `any` types

## Model Setup

Ensure your models use the pagination plugin:

```typescript
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = new mongoose.Schema({
    // your schema...
});

ProductSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model('Product', ProductSchema);
export type ProductDocument = mongoose.Document & {
    // your type definition...
};
```

## Troubleshooting

### Error: Cannot find name 'PaginateOptions'
**Solution**: Don't import from `mongoose-paginate-v2`. Use our custom types from `pagination.types.ts`

### Error: Property 'paginate' does not exist on model
**Solution**: Ensure you've added the plugin to your schema:
```typescript
schema.plugin(mongoosePaginate);
```

### TypeScript errors in base.service.ts
**Solution**: Make sure `tsconfig.json` includes `"src/types"` in `typeRoots`:
```json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./src/types"]
  }
}
```

## Files Modified/Created

1. ✅ Created: `src/types/mongoose-pagination.d.ts` - Custom type definitions
2. ✅ Updated: `src/types/pagination.types.ts` - Added documentation
3. ✅ Updated: `src/services/base.service.ts` - Better type annotations
4. ✅ Created: `PAGINATION_SETUP.md` - This documentation

## Next Steps

1. **Verify Build**: Run `npm run build` to ensure no TypeScript errors
2. **Test Endpoints**: Test pagination on existing endpoints
3. **Update Controllers**: Use the `PaginatedResponse<T>` type in controller responses
4. **Add to Other Services**: Extend `BaseService` in all your service classes

---

**Summary**: You no longer need to import types from `mongoose-paginate-v2`. Use our custom type system for better reliability and type safety! 🎉
