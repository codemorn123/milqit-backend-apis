# Quick Reference: Clean Code Model Development

## 🚀 Quick Start

### 1. Copy Template
```bash
cp src/models/template.model.ts src/models/your-model.model.ts
```

### 2. Find & Replace
Replace `TEMPLATE_NAME` with `YourModel` (e.g., `Product`, `Order`)

### 3. Define Your Fields
Update the interface and schema with your actual fields

---

## 📦 Available Schema Helpers

### String Fields
```typescript
name: StringField.required(trim?, maxlength?)
description: StringField.optional(trim?, maxlength?)
slug: StringField.unique(trim?, maxlength?)
email: EmailField.required() | EmailField.optional()
phone: PhoneField.required() | PhoneField.optional()
url: URLField.required() | URLField.optional()
slug: SlugField()
```

### Number Fields
```typescript
price: NumberField.required(min?, max?)
quantity: NumberField.optional(min?, max?)
likes: NumberField.positiveRequired()
views: NumberField.positiveOptional()
```

### Boolean Fields
```typescript
isActive: BooleanField.required(default?)
isFeatured: BooleanField.optional(default?)
```

### Date Fields
```typescript
startDate: DateField.required()
endDate: DateField.optional()
expiresAt: DateField.withDefault(Date.now)
```

### Enum Fields
```typescript
status: EnumField.required(['active', 'inactive'], 'active')
role: EnumField.optional(['admin', 'user'])
```

### Reference Fields
```typescript
userId: ObjectIdField.required('User', indexed?)
categoryId: ObjectIdField.optional('Category', indexed?)
```

### Embedded Schemas
```typescript
images: [ImageSchema]
location: LocationSchema
address: AddressSchema
deviceInfo: DeviceInfoSchema
geoPoint: GeoPointSchema
```

---

## 🎯 Common Patterns

### Standard Model Structure
```typescript
import mongoose, { Schema, PaginateModel } from 'mongoose';
import { IBaseDocument } from '../types/model.types';
import { createSchemaOptions, ... } from '../utils/schema.helpers';

// 1. Interfaces
export interface IModel { ... }
export interface IModelDocument extends IModel, IBaseDocument { ... }
export interface IModelModel extends PaginateModel<IModelDocument> { ... }

// 2. Schema
const ModelSchema = new Schema<IModelDocument>({ ... }, createSchemaOptions());

// 3. Indexes
ModelSchema.index({ field: 1 });

// 4. Methods & Statics
ModelSchema.methods.instanceMethod = function() { ... };
ModelSchema.statics.staticMethod = function() { ... };

// 5. Plugins
ModelSchema.plugin(mongoosePaginate);

// 6. Export
export const ModelClass = mongoose.model<IModelDocument, IModelModel>('Model', ModelSchema);
```

### Instance Methods
```typescript
// In interface
export interface IModelDocument extends IModel, IBaseDocument {
  activate(): Promise<void>;
  isExpired(): boolean;
}

// In schema
ModelSchema.methods.activate = async function(this: IModelDocument): Promise<void> {
  this.isActive = true;
  await this.save();
};
```

### Static Methods
```typescript
// In interface
export interface IModelModel extends PaginateModel<IModelDocument> {
  findActive(limit?: number): Promise<IModelDocument[]>;
}

// In schema
ModelSchema.statics.findActive = function(limit = 20): Promise<IModelDocument[]> {
  return this.find({ isActive: true }).limit(limit);
};
```

### Virtual Fields
```typescript
ModelSchema.virtual('fullName').get(function(this: IModelDocument) {
  return `${this.firstName} ${this.lastName}`;
});
```

### Indexes
```typescript
// Single field
ModelSchema.index({ userId: 1 });
ModelSchema.index({ createdAt: -1 });

// Compound
ModelSchema.index({ userId: 1, status: 1 });

// Text search
ModelSchema.index({ name: 'text', description: 'text' });

// Unique
ModelSchema.index({ email: 1 }, { unique: true });
```

### Middleware
```typescript
// Pre-save
ModelSchema.pre('save', function(next) {
  // Do something before save
  next();
});

// Post-save
ModelSchema.post('save', function(doc) {
  console.log('Saved:', doc._id);
});
```

---

## ✅ Type Safety Checklist

- [ ] No `any` types used
- [ ] All methods have return types
- [ ] All functions have parameter types
- [ ] Interfaces properly extend `IBaseDocument`
- [ ] Model properly extends `PaginateModel<T>`
- [ ] Static methods in both interface and implementation
- [ ] Instance methods in both interface and implementation

---

## 🔍 Common Use Cases

### User Reference
```typescript
userId: ObjectIdField.required('User', true),

// With populate
.populate('userId', 'name email phone')
```

### Soft Delete
```typescript
isDeleted: BooleanField.optional(false),
deletedAt: DateField.optional(),
deletedBy: ObjectIdField.optional('User'),
```

### Status Management
```typescript
status: EnumField.required(['active', 'inactive', 'pending'], 'pending'),
isActive: BooleanField.optional(true),

// Index for performance
ModelSchema.index({ status: 1, isActive: 1 });
```

### Timestamps
```typescript
// Automatic with createSchemaOptions()
// Adds: createdAt, updatedAt
```

### Images/Media
```typescript
images: [ImageSchema],  // { url, key, alt? }
thumbnail: ImageSchema,
```

### Location
```typescript
location: LocationSchema,  // { latitude, longitude, address? }

// For geospatial queries
coordinates: GeoPointSchema,  // { type: 'Point', coordinates: [lon, lat] }
```

### Pricing
```typescript
mrp: NumberField.positiveRequired(),
sellingPrice: NumberField.positiveRequired(),
discount: NumberField.positiveOptional(),

// Virtual for discount percentage
ModelSchema.virtual('discountPercentage').get(function() {
  return ((this.mrp - this.sellingPrice) / this.mrp) * 100;
});
```

---

## 📚 Reserved Resources

### Files
- `/src/types/model.types.ts` - Common types
- `/src/utils/schema.helpers.ts` - Schema helpers
- `/src/models/template.model.ts` - Copy this for new models
- `/docs/MODEL_REFACTORING_GUIDE.md` - Full documentation

### Refactored Examples
- `/src/models/banner.model.ts` - Simple model
- `/src/models/reel.model.ts` - Complex with methods
- `/src/models/base.ts` - Base usage

---

## ⚡ Performance Tips

### Indexes
```typescript
// Index frequently queried fields
ModelSchema.index({ userId: 1 });

// Compound index for common query combinations
ModelSchema.index({ userId: 1, isActive: 1 });

// Descending for recent-first queries
ModelSchema.index({ createdAt: -1 });

// Text search
ModelSchema.index({ name: 'text' });
```

### Populate
```typescript
// Select only needed fields
.populate('userId', 'name email')

// Multiple populates
.populate('userId', 'name')
.populate('categoryId', 'name slug')

// Nested populate
.populate({
  path: 'userId',
  select: 'name email',
  populate: { path: 'addresses' }
})
```

### Lean Queries
```typescript
// In services, use lean for read-only
const docs = await Model.find({}).lean<IModel[]>();

// With QueryBuilder
builder.exec() // Already uses lean
```

---

## 🐛 Common Issues

### Issue: TypeScript Error on populate
```typescript
// ❌ Wrong
builder.exec('userId')

// ✅ Correct
builder.exec(['userId'])
builder.exec({ path: 'userId', select: 'name' })
```

### Issue: Missing _id field
```typescript
// ✅ Already included in IBaseDocument
export interface IModel extends IBaseDocument { }
```

### Issue: Timestamps not working
```typescript
// ✅ Use createSchemaOptions()
const Schema = new Schema({...}, createSchemaOptions());
```

---

## 📞 Need Help?

1. Check `/docs/MODEL_REFACTORING_GUIDE.md`
2. Look at refactored examples
3. Review schema helpers in `/src/utils/schema.helpers.ts`
4. Check common types in `/src/types/model.types.ts`
