# Model Refactoring Guide

## Overview
This guide outlines the clean code standards and best practices for all Mongoose models in this project.

## Core Principles

### 1. **Centralized Type Definitions**
- All common interfaces are defined in `/src/types/model.types.ts`
- Model-specific types are defined at the top of each model file
- Use `IBaseDocument` from `model.types.ts` for all document interfaces

### 2. **Reusable Schema Helpers**
- Schema field definitions are in `/src/utils/schema.helpers.ts`
- Use helper functions instead of inline schema definitions
- Promotes consistency and reduces code duplication

### 3. **Consistent Model Structure**
Every model file should follow this structure:

```typescript
// 1. Imports
import mongoose, { Schema, Model } from 'mongoose';
import { IBaseDocument } from '../types/model.types';
import { createSchemaOptions, StringField, ... } from '../utils/schema.helpers';

// 2. Interfaces
export interface IModelName {
  // Base fields
}

export interface IModelNameDocument extends IModelName, IBaseDocument {
  // Instance methods
}

export interface IModelNameModel extends Model<IModelNameDocument> {
  // Static methods
}

// 3. Schema Definition
const ModelNameSchema = new Schema<IModelNameDocument>(
  {
    // Fields using schema helpers
  },
  createSchemaOptions()
);

// 4. Virtuals (if needed)
ModelNameSchema.virtual('fieldName').get(function() { ... });

// 5. Indexes
ModelNameSchema.index({ field: 1 });

// 6. Middleware (if needed)
ModelNameSchema.pre('save', function() { ... });

// 7. Instance Methods
ModelNameSchema.methods.methodName = function() { ... };

// 8. Static Methods
ModelNameSchema.statics.staticMethod = function() { ... };

// 9. Plugins
ModelNameSchema.plugin(mongoosePaginate);

// 10. Export
export const ModelNameClass = mongoose.model<IModelNameDocument, IModelNameModel>('ModelName', ModelNameSchema);
export default ModelNameClass;
```

## Schema Helper Usage

### String Fields
```typescript
// Required string with maxlength
title: StringField.required(true, 200),

// Optional string
description: StringField.optional(true, 1000),

// Unique string
slug: StringField.unique(true, 100),

// Email
email: EmailField.required(),
email: EmailField.optional(),

// Phone
phone: PhoneField.required(),

// URL
imageUrl: URLField.required(),
redirectLink: URLField.optional(),
```

### Number Fields
```typescript
// Required number with min/max
price: NumberField.required(0, 10000),

// Optional number
quantity: NumberField.optional(0),

// Positive numbers only
likes: NumberField.positiveRequired(),
views: NumberField.positiveOptional(),
```

### Boolean Fields
```typescript
// With default value
isActive: BooleanField.optional(true),
isFeatured: BooleanField.optional(false),

// Required
isDeleted: BooleanField.required(false),
```

### Enum Fields
```typescript
// Required enum
status: EnumField.required(['active', 'inactive', 'pending'], 'pending'),

// Optional enum
role: EnumField.optional(['admin', 'user'])
```

### ObjectId (References)
```typescript
// Required reference with index
userId: ObjectIdField.required('User', true),

// Optional reference
categoryId: ObjectIdField.optional('Category'),
```

### Common Subdocuments
```typescript
// Images
images: [ImageSchema],

// Location
location: LocationSchema,

// Device info
deviceInfo: DeviceInfoSchema,

// Address
addresses: [AddressSchema],
```

## Type Safety Best Practices

### 1. **No `any` Types**
❌ Bad:
```typescript
export interface ICartModel extends Model<ICartDocument> {
  getCartStats(userId: string): Promise<any>;
}
```

✅ Good:
```typescript
export interface ICartStats {
  total: number;
  totalValue: number;
  totalItems: number;
  byStatus: Record<string, { count: number; amount: number; items: number }>;
}

export interface ICartModel extends Model<ICartDocument> {
  getCartStats(userId: string): Promise<ICartStats>;
}
```

### 2. **Explicit Return Types**
❌ Bad:
```typescript
ReelSchema.statics.findActiveReels = function(limit = 20) {
  return this.find({ isActive: true }).limit(limit);
}
```

✅ Good:
```typescript
ReelSchema.statics.findActiveReels = function(limit = 20): Promise<IReelDocument[]> {
  return this.find({ isActive: true }).limit(limit);
}
```

### 3. **Strong Typing for Instance Methods**
```typescript
// Define return type interface
export interface IToggleLikeResult {
  liked: boolean;
  likesCount: number;
}

// Use in method signature
ReelSchema.methods.toggleLike = async function(
  this: IReelDocument,
  userId: string
): Promise<IToggleLikeResult> {
  // Implementation
};
```

## Common Patterns

### 1. **Pagination Support**
```typescript
import mongoosePaginate from 'mongoose-paginate-v2';
import { PaginateModel } from 'mongoose';

export interface IModelNameModel extends PaginateModel<IModelNameDocument> {
  // Your static methods
}

// Apply plugin
ModelNameSchema.plugin(mongoosePaginate);

// Export with PaginateModel
export const ModelNameClass = mongoose.model<IModelNameDocument, IModelNameModel>('ModelName', ModelNameSchema);
```

### 2. **Indexes for Performance**
```typescript
// Single field indexes
ModelNameSchema.index({ userId: 1 });
ModelNameSchema.index({ createdAt: -1 });

// Compound indexes
ModelNameSchema.index({ userId: 1, status: 1 });
ModelNameSchema.index({ isActive: 1, createdAt: -1 });

// Text search indexes
ModelNameSchema.index({ name: 'text', description: 'text' });
```

### 3. **Virtual Fields**
```typescript
// Computed fields
ModelNameSchema.virtual('fullName').get(function(this: IDocument) {
  return `${this.firstName} ${this.lastName}`;
});

// Related documents (populate)
ModelNameSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'userId'
});
```

### 4. **Pre/Post Hooks**
```typescript
// Pre-save
ModelNameSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    // Hash password
  }
  next();
});

// Post-save
ModelNameSchema.post('save', function(doc) {
  console.log(`Document saved: ${doc._id}`);
});
```

## Migration Checklist

When refactoring an existing model:

- [ ] Import `IBaseDocument` from `model.types.ts`
- [ ] Import schema helpers from `schema.helpers.ts`
- [ ] Replace inline field definitions with helper functions
- [ ] Add proper TypeScript interfaces for all methods
- [ ] Remove all `any` types
- [ ] Add proper return types to all methods
- [ ] Use `createSchemaOptions()` for consistent schema options
- [ ] Add appropriate indexes for performance
- [ ] Document instance and static methods
- [ ] Export model with proper type parameters

## Examples

See these refactored models for reference:
- `/src/models/banner.model.ts` - Simple model example
- `/src/models/reel.model.ts` - Model with instance methods and virtuals
- `/src/models/base.ts` - Base interface usage

## Benefits

1. **Type Safety**: Catch errors at compile time
2. **Consistency**: All models follow the same pattern
3. **Maintainability**: Changes to common fields are centralized
4. **Reusability**: Common schemas and helpers reduce duplication
5. **Documentation**: Clear interfaces serve as inline documentation
6. **IDE Support**: Better autocomplete and IntelliSense
