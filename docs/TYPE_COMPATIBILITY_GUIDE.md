# Service Method Type Compatibility Guide

## Problem: Interface vs Document Types

When a service extends `BaseService<TDocument>`, all overridden methods must use the `TDocument` type, not plain interfaces.

### The Issue

**Wrong:**
```typescript
import { ReelModel, IReelDocument } from '../models/reel.model';
import { IReel } from '../types/reel.types';

class ReelService extends BaseService<IReelDocument> {
    // ❌ WRONG: Using IReel instead of IReelDocument
    public async create(data: Partial<IReel>): Promise<IReel> {
        return super.create(data);
    }
}
```

**Error:**
```
Type 'Promise<IReelDocument>' is not assignable to type 'Promise<IReel>'
  Types of property '_id' are incompatible
```

**Why:**
- `IReel` has `_id: string` and `likedBy: string[]`
- `IReelDocument` has `_id: ObjectId` and `likedBy: ObjectId[]`
- When you call `super.create()`, it returns `IReelDocument`, not `IReel`

### The Solution

**Correct:**
```typescript
import { ReelModel, IReelDocument } from '../models/reel.model';

class ReelService extends BaseService<IReelDocument> {
    // ✅ CORRECT: Using IReelDocument
    public async create(
        data: Partial<IReelDocument>,
        file?: Express.Multer.File
    ): Promise<IReelDocument> {
        const payload = { ...data, /* ... */ };
        return super.create(payload);
    }

    public async update(
        id: string,
        data: Partial<IReelDocument>,
        file?: Express.Multer.File
    ): Promise<IReelDocument> {
        const payload: any = { ...data };
        return super.update(id, payload);
    }
}
```

---

## Understanding the Type Difference

### Plain Interface (IReel)
Used for API contracts, DTOs, and plain data:
```typescript
export interface IReel {
    _id: string;              // ← String for JSON
    title: string;
    likedBy: string[];        // ← Array of strings
    createdAt: Date;
}
```

### Document Interface (IReelDocument)
Used for Mongoose documents, database operations:
```typescript
export interface IReelDocument extends IReel, IBaseDocument {
    _id: ObjectId;            // ← Mongoose ObjectId
    likedBy: ObjectId[];      // ← Array of ObjectIds
    createdAt: Date;
    // Plus Mongoose methods
    save(): Promise<this>;
    populate(path: string): Promise<this>;
    // ... etc
}
```

---

## When to Use Each Type

### Use Plain Interface (e.g., `IReel`)

1. **API Responses** - After converting to JSON:
```typescript
public async getReels(): Promise<IReelResponse> {
    const docs = await ReelModel.find().lean();
    return docs.map(doc => this.mapToResponse(doc));
}
```

2. **Request Payloads** - From client:
```typescript
interface ICreateReelRequest {
    title: string;
    description?: string;
}
```

3. **Plain Data Objects** - No Mongoose functionality needed:
```typescript
const plainData: IReel = {
    _id: doc._id.toString(),
    title: doc.title,
    // ...
};
```

### Use Document Interface (e.g., `IReelDocument`)

1. **Service Methods** - Interacting with database:
```typescript
class ReelService extends BaseService<IReelDocument> {
    public async create(data: Partial<IReelDocument>): Promise<IReelDocument> {
        return super.create(data);
    }
}
```

2. **Instance Methods** - Working with Mongoose documents:
```typescript
public async toggleLike(reelId: string): Promise<IReelDocument> {
    const reel: IReelDocument = await ReelModel.findById(reelId);
    reel.likes += 1;
    await reel.save();
    return reel;
}
```

3. **Query Results** - From database:
```typescript
const reels: IReelDocument[] = await ReelModel.find({ isActive: true });
```

---

## Common Patterns

### Pattern 1: Accept Document, Return Document
```typescript
public async create(data: Partial<IReelDocument>): Promise<IReelDocument> {
    const doc = await ReelModel.create(data);
    return doc;
}
```

### Pattern 2: Accept Plain Data, Work with Document
```typescript
public async createFromPayload(
    payload: ICreateReelRequest
): Promise<IReelDocument> {
    // Convert plain payload to document data
    const data: Partial<IReelDocument> = {
        title: payload.title,
        description: payload.description,
        likes: 0,
        likedBy: [],
        isActive: true
    };
    return this.create(data);
}
```

### Pattern 3: Return Plain Response After Processing Document
```typescript
public async getReelById(id: string): Promise<IReelResponse> {
    const doc: IReelDocument = await ReelModel.findById(id);
    if (!doc) throw new APIError('Not found', 404);
    
    // Convert Document to Response
    return this.mapToResponse(doc);
}

private mapToResponse(doc: IReelDocument): IReelResponse {
    return {
        _id: doc._id.toString(),
        title: doc.title,
        // ... convert ObjectIds to strings
    };
}
```

---

## Fixing Services After Model Refactoring

### Step 1: Update Class Declaration
```typescript
// Before
class ReelService extends BaseService<IReel> { }

// After
class ReelService extends BaseService<IReelDocument> { }
```

### Step 2: Update Method Signatures
```typescript
// Before
public async create(data: Partial<IReel>): Promise<IReel>

// After
public async create(data: Partial<IReelDocument>): Promise<IReelDocument>
```

### Step 3: Update Return Statements
Usually no changes needed if you were calling `super.create()` or `super.update()`:
```typescript
// This automatically returns the correct type now
return super.create(data);
```

### Step 4: Update Local Variables
```typescript
// Before
const reel: IReel = await ReelModel.findById(id);

// After
const reel: IReelDocument = await ReelModel.findById(id);
```

---

## Controller Integration

Controllers can still use plain interfaces for requests/responses:

```typescript
// Controller
export class ReelController {
    @Post('/')
    public async createReel(
        @Body() body: ICreateReelRequest,  // ← Plain interface (from client)
        @UploadedFile() file: Express.Multer.File
    ): Promise<IReelResponse> {           // ← Plain interface (to client)
        // Service works with Documents internally
        const doc: IReelDocument = await reelService.create({
            title: body.title,
            description: body.description
        }, file);
        
        // Convert Document to Response
        return this.mapToResponse(doc);
    }
    
    private mapToResponse(doc: IReelDocument): IReelResponse {
        return {
            _id: doc._id.toString(),      // ObjectId → string
            title: doc.title,
            videoUrl: doc.videoUrl,
            likes: doc.likes,
            isActive: doc.isActive,
            createdAt: doc.createdAt.toISOString(),
            updatedAt: doc.updatedAt.toISOString()
        };
    }
}
```

---

## Summary: Key Rules

1. **Services extending `BaseService<T>`:**
   - Use Document type for `T`
   - All overridden methods must use Document types

2. **Plain interfaces are for:**
   - API requests/responses
   - DTOs (Data Transfer Objects)
   - JSON representations

3. **Document interfaces are for:**
   - Database operations
   - Service methods
   - Mongoose functionality

4. **Type conversion:**
   - Accept plain data from controllers
   - Work with Documents in services
   - Convert Documents to plain responses for controllers

---

## Files Fixed

### Services Using Correct Document Types:
- ✅ `/src/services/reel.service.ts` - Uses `IReelDocument`
- ✅ `/src/services/banner/banner.service.ts` - Uses `BannerDocument`

### Models Providing Document Types:
- ✅ `/src/models/reel.model.ts` - Exports `IReelDocument`
- ✅ `/src/models/banner.model.ts` - Exports `BannerDocument`

---

## Related Documentation

- `/docs/MODEL_REFACTORING_GUIDE.md` - Model structure guide
- `/docs/MIGRATION_GUIDE.md` - Import fixing guide
- `/docs/ISSUES_FIXED.md` - All resolved issues
