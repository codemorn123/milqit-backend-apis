# Migration Guide: Fixing Service Imports After Model Refactoring

## Common Issues After Refactoring

When refactoring models to use the new clean code structure, you may encounter these TypeScript errors in services:

### Issue 1: Export Not Found

**Error:**
```
error TS2724: '"../models/reel.model"' has no exported member named 'ReelModel'. 
Did you mean 'IReelModel'?
```

**Cause:** The model was renamed from `ReelModel` to `ReelModelClass`

**Solution:** We've added backwards-compatible exports to all refactored models:

```typescript
// In model file (e.g., reel.model.ts)
export const ReelModelClass = mongoose.model<IReelDocument, IReelModel>('Reel', ReelSchema);

// Backwards compatibility - use ReelModelClass in new code
export const ReelModel = ReelModelClass;

export default ReelModelClass;
```

**Action Required:** None! Existing imports will continue to work.

---

### Issue 2: Wrong Type Parameter in Service

**Error:**
```
error TS2344: Type 'IReel' does not satisfy the constraint 'Document<...>'.
Type 'IReel' is missing the following properties from type 'Document<...>': 
$assertPopulated, $clearModifiedPaths, ...
```

**Cause:** `BaseService<T>` expects a Mongoose Document type, not just the interface.

**Wrong:**
```typescript
class ReelService extends BaseService<IReel> {
    constructor() {
        super(ReelModel as any, ['title']);
    }
}
```

**Correct:**
```typescript
import { ReelModel, IReelDocument } from '../models/reel.model';

class ReelService extends BaseService<IReelDocument> {
    constructor() {
        super(ReelModel as any, ['title']);
    }
}
```

**Rule:** Always use the `IXxxDocument` interface (not `IXxx`) when extending `BaseService`.

---

## Model Export Naming Convention

All refactored models follow this pattern:

### Exports:
```typescript
// Primary export (use this in new code)
export const ModelNameClass = mongoose.model<IDocument, IModel>('ModelName', Schema);

// Backwards compatibility (for existing code)
export const ModelName = ModelNameClass;
export const ModelNameModel = ModelNameClass;

// Default export
export default ModelNameClass;
```

### Interfaces:
```typescript
export interface IModelName { ... }           // Base interface
export interface IModelNameDocument { ... }   // Document interface (extends IBaseDocument)
export interface IModelNameModel { ... }      // Model interface (extends PaginateModel)
```

---

## Service Import Patterns

### Pattern 1: Import Model + Document (Recommended)
```typescript
import { ModelNameModel, IModelNameDocument } from '../models/model-name.model';

class SomeService extends BaseService<IModelNameDocument> {
    constructor() {
        super(ModelNameModel, ['searchField']);
    }
}
```

### Pattern 2: Import Default + Document
```typescript
import ModelName, { IModelNameDocument } from '../models/model-name.model';

class SomeService extends BaseService<IModelNameDocument> {
    constructor() {
        super(ModelName, ['searchField']);
    }
}
```

### Pattern 3: Import All Types
```typescript
import { 
    ModelNameModel, 
    IModelName, 
    IModelNameDocument 
} from '../models/model-name.model';

class SomeService extends BaseService<IModelNameDocument> {
    private processModel(data: IModelName): void {
        // Use IModelName for plain data objects
    }
    
    private processDocument(doc: IModelNameDocument): void {
        // Use IModelNameDocument for Mongoose documents
    }
}
```

---

## Quick Fix Checklist

When you see TypeScript errors after model refactoring:

- [ ] Check if import name matches the new export name
- [ ] Import the `IXxxDocument` interface (not `IXxx`)
- [ ] Use `IXxxDocument` in `BaseService<IXxxDocument>`
- [ ] If service has custom methods, update types to use `IXxxDocument`
- [ ] Check that model exports include backwards compatibility exports

---

## Refactored Models (So Far)

### ✅ Banner Model
- Export: `BannerModelClass`, `Banner` (compatibility)
- Document: `BannerDocument`
- Model: `BannerModel`

### ✅ Reel Model
- Export: `ReelModelClass`, `ReelModel` (compatibility)
- Document: `IReelDocument`
- Model: `IReelModel`

---

## For Future Model Refactoring

When refactoring a model that's used in services:

1. **Keep backwards-compatible exports:**
   ```typescript
   export const NewModelClass = mongoose.model(...);
   export const OldModelName = NewModelClass;  // Don't break existing code
   export default NewModelClass;
   ```

2. **Update service to use Document type:**
   ```typescript
   // Before
   class Service extends BaseService<IModel> { }
   
   // After
   class Service extends BaseService<IModelDocument> { }
   ```

3. **Test compilation:**
   ```bash
   npm run build
   # or
   tsc --noEmit
   ```

4. **Check all imports:**
   ```bash
   # Find all files importing the model
   grep -r "from '../models/model-name.model'" src/
   ```

---

## Related Documentation

- `/docs/MODEL_REFACTORING_GUIDE.md` - Complete refactoring guide
- `/docs/QUICK_REFERENCE.md` - Quick lookup for patterns
- `/src/models/template.model.ts` - Template with correct export pattern
