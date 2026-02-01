import { Model, Document, FilterQuery } from 'mongoose';
import APIError from '../error/api-error';
import {
    PaginatedResponse,
    PaginationQuery,
    PaginationOptions,
    parsePaginationQuery,
    toPaginatedResponse
} from '../types/pagination.types';
import { IPaginateModel } from '../types/service.types';

/**
 * Generic Base Service with Pagination Support
 * Uses mongoose-paginate-v2 for automatic pagination
 */
export abstract class BaseService<T extends Document = any, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
    protected readonly model: Model<T> & IPaginateModel<T>;
    protected readonly searchFields: string[];

    constructor(
        model: any, // Accepting as 'any' for flexibility with different model types
        searchFields: string[] = []
    ) {
        this.model = model;
        this.searchFields = searchFields;
    }

    /**
     * Create a new document
     */
    /**
     * Create a new document
     */
    async create(data: CreateDTO): Promise<T> {
        const doc = await this.model.create(data as unknown as Partial<T>);
        return doc; // create() returns a Mongoose document, so toJSON will handle transformation when sent via response
    }

    /**
     * Get all documents with automatic pagination
     * @param query - Pagination and search parameters
     * @param filter - Additional MongoDB filter
     * @param options - Override pagination options
     */
    async getAll(
        query: PaginationQuery = {},
        filter: FilterQuery<T> = {},
        options?: PaginationOptions
    ): Promise<PaginatedResponse<T>> {
        // Parse pagination parameters
        const paginationOptions = options || parsePaginationQuery(query);

        // Ensure lean is true for performance unless explicitly set to false
        if (paginationOptions.lean === undefined) {
            paginationOptions.lean = true;
        }

        // Build search filter if search term provided
        const searchFilter = this.buildSearchFilter(query.search);

        // Combine filters
        const combinedFilter: FilterQuery<T> = {
            ...filter,
            ...(searchFilter ? searchFilter : {}),
        };

        // Execute paginated query
        const result = await this.model.paginate(
            combinedFilter,
            paginationOptions
        );

        // Normalize lean documents if lean is true
        if (paginationOptions.lean && result.docs) {
            result.docs = result.docs.map(doc => this.normalizeLeanDoc(doc));
        }

        return toPaginatedResponse(result);
    }

    /**
     * Get a single document by ID
     */
    async getOne(id: string): Promise<T> {
        const doc = await this.model.findById(id).select('-__v').lean<T>();
        if (!doc) {
            throw new APIError('Document not found', 404);
        }
        return this.normalizeLeanDoc(doc);
    }

    /**
     * Get a single document by filter
     */
    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        const doc = await this.model.findOne(filter).select('-__v').lean<T>();
        return doc ? this.normalizeLeanDoc(doc) : null;
    }

    /**
     * Update a document by ID
     */
    async update(id: string, data: UpdateDTO): Promise<T> {
        const doc = await this.model.findByIdAndUpdate(id, data as unknown as any, {
            new: true,
            runValidators: true
        }).select('-__v').lean<T>();

        if (!doc) {
            throw new APIError('Document not found', 404);
        }
        return this.normalizeLeanDoc(doc);
    }

    /**
     * Delete a document by ID
     */
    async delete(id: string): Promise<{ message: string; status: number }> {
        const doc = await this.model.findByIdAndDelete(id);
        if (!doc) {
            throw new APIError('Document not found', 404);
        }
        return { message: 'Document deleted successfully', status: 200 };
    }

    /**
     * Count documents matching filter
     */
    async count(filter: FilterQuery<T> = {}): Promise<number> {
        return await this.model.countDocuments(filter);
    }

    /**
     * Check if document exists
     */
    async exists(filter: FilterQuery<T>): Promise<boolean> {
        const count = await this.model.countDocuments(filter).limit(1);
        return count > 0;
    }

    /**
     * Helper to normalize lean documents:
     * - Converts _id to id
     * - Removes _id and __v
     */
    protected normalizeLeanDoc(doc: any): T {
        if (doc && doc._id) {
            doc.id = doc._id.toString();
            delete doc._id;
            delete doc.__v;
        }
        return doc;
    }

    /**
     * Build search filter from search term and search fields
     * @private
     */
    private buildSearchFilter(searchTerm?: string): FilterQuery<T> | null {
        if (!searchTerm || this.searchFields.length === 0) {
            return null;
        }

        const searchRegex = new RegExp(searchTerm, 'i');
        const orConditions = this.searchFields.map(field => ({
            [field]: searchRegex
        }));

        return { $or: orConditions } as FilterQuery<T>;
    }
}
