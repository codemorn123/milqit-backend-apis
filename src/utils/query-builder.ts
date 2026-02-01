import { FilterQuery, Model, PopulateOptions } from 'mongoose';
import { IFilter, PaginatedResponse } from '../types/common.types';

export class QueryBuilder<T, F extends IFilter = IFilter> {
    public model: Model<T>;
    public query: FilterQuery<T>;
    public queryParams: F;

    constructor(model: Model<T>, queryParams: F) {
        this.model = model;
        this.queryParams = queryParams;
        this.query = {};
    }

    /**
     * Standard filter that removes pagination fields and applies remaining as direct matches.
     * Also handles 'search' if searchFields are provided.
     */
    filter(searchFields: string[] = [], extraExcludedFields: string[] = []): this {
        const queryObj = { ...this.queryParams };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'sortBy', 'sortOrder', ...extraExcludedFields];
        excludedFields.forEach((el) => delete queryObj[el as keyof IFilter]);

        // Handle search
        if (this.queryParams.search && searchFields.length > 0) {
            const searchRegex = new RegExp(this.queryParams.search, 'i');
            this.query.$or = searchFields.map((field) => ({
                [field]: searchRegex,
            })) as FilterQuery<T>['$or'];
        }

        // Merge other direct filters from query params
        this.query = { ...this.query, ...queryObj };

        return this;
    }

    /**
     * generic filter method to add custom conditions
     */
    addFilter(filter: FilterQuery<T>): this {
        this.query = { ...this.query, ...filter };
        return this;
    }

    /**
     * Helper to add a specific field sort
     */
    sort(): { sort: { [key: string]: 1 | -1 } } {
        const sortBy = this.queryParams.sortBy || 'createdAt';
        const sortOrder = this.queryParams.sortOrder === 'asc' ? 1 : -1;
        return { sort: { [sortBy]: sortOrder } };
    }

    async exec(populateOptions?: PopulateOptions | (string | PopulateOptions)[]): Promise<PaginatedResponse<T>> {
        const page = Math.max(1, Number(this.queryParams.page) || 1);
        const limit = Math.max(1, Number(this.queryParams.limit) || 10);
        const skip = (page - 1) * limit;

        const sortOptions = this.sort().sort;

        let query = this.model.find(this.query).sort(sortOptions).skip(skip).limit(limit);

        if (populateOptions) {
            query = query.populate(populateOptions);
        }

        const [docs, totalDocs] = await Promise.all([
            query.lean<T[]>(),
            this.model.countDocuments(this.query),
        ]);

        const totalPages = Math.ceil(totalDocs / limit);

        return {
            docs,
            totalDocs,
            limit,
            page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            pagingCounter: (page - 1) * limit + 1,
        };
    }
}
