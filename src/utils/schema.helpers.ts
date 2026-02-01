import { Schema, SchemaDefinitionProperty } from 'mongoose';

/**
 * Common schema field definitions for reuse across models
 */

export const StringField = {
    required: (trim = true, maxlength?: number): SchemaDefinitionProperty<string> => ({
        type: String,
        required: true,
        trim,
        ...(maxlength && { maxlength }),
    }),
    optional: (trim = true, maxlength?: number): SchemaDefinitionProperty<string> => ({
        type: String,
        trim,
        ...(maxlength && { maxlength }),
    }),
    unique: (trim = true, maxlength?: number): SchemaDefinitionProperty<string> => ({
        type: String,
        required: true,
        unique: true,
        trim,
        ...(maxlength && { maxlength }),
    }),
};

export const NumberField = {
    required: (min?: number, max?: number): SchemaDefinitionProperty<number> => ({
        type: Number,
        required: true,
        ...(min !== undefined && { min }),
        ...(max !== undefined && { max }),
    }),
    optional: (min?: number, max?: number): SchemaDefinitionProperty<number> => ({
        type: Number,
        ...(min !== undefined && { min }),
        ...(max !== undefined && { max }),
    }),
    positiveRequired: (): SchemaDefinitionProperty<number> => ({
        type: Number,
        required: true,
        min: 0,
    }),
    positiveOptional: (): SchemaDefinitionProperty<number> => ({
        type: Number,
        min: 0,
    }),
};

export const BooleanField = {
    required: (defaultValue?: boolean): SchemaDefinitionProperty<boolean> => ({
        type: Boolean,
        required: true,
        ...(defaultValue !== undefined && { default: defaultValue }),
    }),
    optional: (defaultValue?: boolean): SchemaDefinitionProperty<boolean> => ({
        type: Boolean,
        ...(defaultValue !== undefined && { default: defaultValue }),
    }),
};

export const DateField = {
    required: (): SchemaDefinitionProperty<Date> => ({
        type: Date,
        required: true,
    }),
    optional: (): SchemaDefinitionProperty<Date> => ({
        type: Date,
    }),
    withDefault: (defaultValue: Date | (() => Date)): SchemaDefinitionProperty<Date> => ({
        type: Date,
        default: defaultValue,
    }),
};

export const ObjectIdField = {
    required: (ref: string, index = false): SchemaDefinitionProperty => ({
        type: Schema.Types.ObjectId,
        ref,
        required: true,
        ...(index && { index: true }),
    }),
    optional: (ref: string, index = false): SchemaDefinitionProperty => ({
        type: Schema.Types.ObjectId,
        ref,
        ...(index && { index: true }),
    }),
};

export const EnumField = {
    required: <T extends string>(values: T[], defaultValue?: T): SchemaDefinitionProperty<T> => ({
        type: String,
        enum: values,
        required: true,
        ...(defaultValue && { default: defaultValue }),
    } as unknown as SchemaDefinitionProperty<T>),
    optional: <T extends string>(values: T[], defaultValue?: T): SchemaDefinitionProperty<T> => ({
        type: String,
        enum: values,
        ...(defaultValue && { default: defaultValue }),
    } as unknown as SchemaDefinitionProperty<T>),
};

/**
 * Common schema definitions for reusable subdocuments
 */

export const ImageSchema = new Schema(
    {
        url: { type: String, required: true },
        key: { type: String, required: true },
        alt: { type: String },
    },
    { _id: false }
);

export const LocationSchema = new Schema(
    {
        latitude: { type: Number, required: true, min: -90, max: 90 },
        longitude: { type: Number, required: true, min: -180, max: 180 },
        address: { type: String },
    },
    { _id: false }
);

export const DeviceInfoSchema = new Schema(
    {
        platform: {
            type: String,
            enum: ['ios', 'android', 'web', 'other'],
            required: true,
        },
        version: { type: String, maxlength: 20 },
        deviceId: { type: String, maxlength: 255 },
    },
    { _id: false }
);

export const GeoPointSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: (v: number[]) => v.length === 2,
                message: 'Coordinates must have exactly 2 elements [longitude, latitude]',
            },
        },
    },
    { _id: false }
);

export const AddressSchema = new Schema(
    {
        id: { type: String },
        label: { type: String },
        fullName: { type: String, trim: true },
        phone: { type: String, trim: true },
        addressLine1: { type: String, required: true, trim: true },
        addressLine2: { type: String, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        pincode: { type: String, required: true, trim: true },
        landmark: { type: String, trim: true },
        latitude: { type: Number, min: -90, max: 90 },
        longitude: { type: Number, min: -180, max: 180 },
        addressType: {
            type: String,
            enum: ['home', 'work', 'other'],
        },
        isDefault: { type: Boolean, default: false },
    },
    { _id: false }
);

/**
 * Common schema options factory
 */
export const createSchemaOptions = (customOptions: any = {}) => ({
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
        transform: (_: any, ret: any) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
    toObject: {
        virtuals: true,
        transform: (_: any, ret: any) => {
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
    ...customOptions,
});

/**
 * Helper to create indexed fields
 */
export const createIndexedField = (
    fieldDef: SchemaDefinitionProperty,
    indexOptions: { unique?: boolean; sparse?: boolean; } = {}
): SchemaDefinitionProperty => ({
    ...(fieldDef as any),
    index: true,
    ...indexOptions,
});

/**
 * Helper to create email field
 */
export const EmailField = {
    required: (): SchemaDefinitionProperty<string> => ({
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
        validate: {
            validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: 'Please provide a valid email address',
        },
    }),
    optional: (): SchemaDefinitionProperty<string> => ({
        type: String,
        trim: true,
        lowercase: true,
        sparse: true,
        validate: {
            validator: function (v: string) {
                return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please provide a valid email address',
        },
    }),
};

/**
 * Helper to create phone field
 */
export const PhoneField = {
    required: (): SchemaDefinitionProperty<string> => ({
        type: String,
        required: true,
        trim: true,
        index: true,
        validate: {
            validator: (v: string) => /^\\+[1-9]\\d{1,14}$/.test(v),
            message: 'Please provide a valid phone number in E.164 format',
        },
    }),
    optional: (): SchemaDefinitionProperty<string> => ({
        type: String,
        trim: true,
        validate: {
            validator: function (v: string) {
                return !v || /^\\+[1-9]\\d{1,14}$/.test(v);
            },
            message: 'Please provide a valid phone number in E.164 format',
        },
    }),
};

/**
 * Helper to create URL field
 */
export const URLField = {
    required: (): SchemaDefinitionProperty<string> => ({
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (v: string) => /^https?:\/\/.+/.test(v),
            message: 'Please provide a valid URL',
        },
    }),
    optional: (): SchemaDefinitionProperty<string> => ({
        type: String,
        trim: true,
        validate: {
            validator: function (v: string) {
                return !v || /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL',
        },
    }),
};

/**
 * Helper to create slug field
 */
export const SlugField = (): SchemaDefinitionProperty<string> => ({
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
    validate: {
        validator: (v: string) => /^[a-z0-9-]+$/.test(v),
        message: 'Slug can only contain lowercase letters, numbers, and hyphens',
    },
});
