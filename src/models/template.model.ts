import mongoose, { Schema, Model, PaginateModel, QueryWithHelpers } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { IBaseDocument } from '../types/model.types';
import {
    createSchemaOptions,
    StringField,
    NumberField,
    BooleanField,
    DateField,
    ObjectIdField,
    EnumField,
    EmailField,
    PhoneField,
    URLField,
    SlugField,
    ImageSchema,
} from '../utils/schema.helpers';

/**
 * TEMPLATE_NAME Interface
 * 
 * Define the base interface for your model.
 * This should include all fields but no Mongoose-specific properties.
 */
export interface ITEMPLATE_NAME {
    // Basic fields
    name: string;
    description?: string;
    status: 'active' | 'inactive';
    isActive: boolean;

    // Reference fields
    userId: mongoose.Types.ObjectId;
    categoryId?: mongoose.Types.ObjectId;

    // Numeric fields
    count: number;
    price?: number;

    // Date fields
    startDate?: Date;
    endDate?: Date;

    // Array fields
    tags?: string[];
    images?: Array<{ url: string; key: string }>;
}

/**
 * TEMPLATE_NAME Document Interface
 * 
 * Extends the base interface with Mongoose Document.
 * Add instance methods here.
 */
export interface ITEMPLATE_NAMEDocument extends ITEMPLATE_NAME, IBaseDocument {
    // Instance methods
    activate(): Promise<void>;
    deactivate(): Promise<void>;
    isExpired(): boolean;
}

/**
 * TEMPLATE_NAME Query Helpers
 */
export interface ITEMPLATE_NAMEQueryHelpers {
    active<T = ITEMPLATE_NAMEDocument[]>(): QueryWithHelpers<T, ITEMPLATE_NAMEDocument, ITEMPLATE_NAMEQueryHelpers>;
    byStatus<T = ITEMPLATE_NAMEDocument[]>(status: 'active' | 'inactive'): QueryWithHelpers<T, ITEMPLATE_NAMEDocument, ITEMPLATE_NAMEQueryHelpers>;
}

/**
 * TEMPLATE_NAME Model Interface
 * 
 * Extends Mongoose Model with PaginateModel for pagination support.
 * Add static methods here.
 */
export interface ITEMPLATE_NAMEModel extends PaginateModel<ITEMPLATE_NAMEDocument, ITEMPLATE_NAMEQueryHelpers> {
    // Static methods
    findActive(limit?: number): Promise<ITEMPLATE_NAMEDocument[]>;
    findByUser(userId: string): Promise<ITEMPLATE_NAMEDocument[]>;
    findByStatus(status: 'active' | 'inactive'): Promise<ITEMPLATE_NAMEDocument[]>;
}

/**
 * TEMPLATE_NAME Schema Definition
 */
const TEMPLATE_NAMESchema = new Schema<
    ITEMPLATE_NAMEDocument,
    ITEMPLATE_NAMEModel,
    {},
    ITEMPLATE_NAMEQueryHelpers
>(
    {
        // String fields
        name: StringField.required(true, 200),
        description: StringField.optional(true, 1000),

        // Enum fields
        status: EnumField.required(['active', 'inactive'], 'active'),

        // Boolean fields
        isActive: BooleanField.optional(true),

        // Number fields
        count: NumberField.positiveRequired(),
        price: NumberField.positiveOptional(),

        // Date fields
        startDate: DateField.optional(),
        endDate: DateField.optional(),

        // Reference fields (ObjectId)
        userId: ObjectIdField.required('User', true),
        categoryId: ObjectIdField.optional('Category'),

        // Array fields
        tags: [StringField.optional()],
        images: [ImageSchema],
    },
    createSchemaOptions()
);

/**
 * Virtual Fields
 */
TEMPLATE_NAMESchema.virtual('isExpiredVirtual').get(function (this: ITEMPLATE_NAMEDocument) {
    if (!this.endDate) return false;
    return this.endDate < new Date();
});

TEMPLATE_NAMESchema.virtual('displayName').get(function (this: ITEMPLATE_NAMEDocument) {
    return `${this.name} (${this.status})`;
});

/**
 * Indexes for Performance
 */
TEMPLATE_NAMESchema.index({ isActive: 1, createdAt: -1 });
TEMPLATE_NAMESchema.index({ userId: 1, status: 1 });
TEMPLATE_NAMESchema.index({ status: 1, isActive: 1 });
TEMPLATE_NAMESchema.index({ name: 'text', description: 'text' });

/**
 * Pre-save Middleware
 */
TEMPLATE_NAMESchema.pre('save', function (next) {
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
        return next(new Error('Start date must be before end date'));
    }
    next();
});

/**
 * Post-save Middleware
 */
TEMPLATE_NAMESchema.post('save', function (doc: ITEMPLATE_NAMEDocument) {
    console.log(`TEMPLATE_NAME saved: ${doc._id}`);
});

/**
 * Instance Methods
 */
TEMPLATE_NAMESchema.methods.activate = async function (this: ITEMPLATE_NAMEDocument): Promise<void> {
    this.status = 'active';
    this.isActive = true;
    await this.save();
};

TEMPLATE_NAMESchema.methods.deactivate = async function (this: ITEMPLATE_NAMEDocument): Promise<void> {
    this.status = 'inactive';
    this.isActive = false;
    await this.save();
};

TEMPLATE_NAMESchema.methods.isExpired = function (this: ITEMPLATE_NAMEDocument): boolean {
    if (!this.endDate) return false;
    return this.endDate < new Date();
};

/**
 * Static Methods
 */
TEMPLATE_NAMESchema.statics.findActive = function (limit = 20): Promise<ITEMPLATE_NAMEDocument[]> {
    return this.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name email');
};

TEMPLATE_NAMESchema.statics.findByUser = function (userId: string): Promise<ITEMPLATE_NAMEDocument[]> {
    return this.find({
        userId: new mongoose.Types.ObjectId(userId),
        isActive: true,
    }).sort({ createdAt: -1 });
};

TEMPLATE_NAMESchema.statics.findByStatus = function (
    status: 'active' | 'inactive'
): Promise<ITEMPLATE_NAMEDocument[]> {
    return this.find({ status, isActive: true }).sort({ createdAt: -1 });
};

/**
 * Query Helpers
 */
TEMPLATE_NAMESchema.query.active = function <T = ITEMPLATE_NAMEDocument[]>(
    this: QueryWithHelpers<T, ITEMPLATE_NAMEDocument, ITEMPLATE_NAMEQueryHelpers>
) {
    return this.where({ isActive: true });
};

TEMPLATE_NAMESchema.query.byStatus = function <T = ITEMPLATE_NAMEDocument[]>(
    this: QueryWithHelpers<T, ITEMPLATE_NAMEDocument, ITEMPLATE_NAMEQueryHelpers>,
    status: 'active' | 'inactive'
) {
    return this.where({ status });
};

/**
 * Apply Plugins
 */
TEMPLATE_NAMESchema.plugin(mongoosePaginate as any);

/**
 * Export Model
 */
export const TEMPLATE_NAMEModelClass = mongoose.model<ITEMPLATE_NAMEDocument, ITEMPLATE_NAMEModel>(
    'TEMPLATE_NAME',
    TEMPLATE_NAMESchema
);

export const TEMPLATE_NAMEModel = TEMPLATE_NAMEModelClass;

export default TEMPLATE_NAMEModelClass;
