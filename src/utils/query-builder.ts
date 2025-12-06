import { FilterQuery, Model, Query } from 'mongoose';
import { IFilter, PaginatedResponse } from '../types/common.types';

export class QueryBuilder<T> {
    public model: Model<T>;
    public query: FilterQuery<T>;
    public queryParams: IFilter;

    constructor(model: Model<T>, queryParams: IFilter) {
        this.model = model;
        this.queryParams = queryParams;
        this.query = {};
    }

    filter(searchFields: string[] = []): this {
        const queryObj = { ...this.queryParams };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search', 'sortBy', 'sortOrder'];
        excludedFields.forEach((el) => delete queryObj[el as keyof IFilter]);

        // Handle specific filters like isActive if present in queryParams
        if (this.queryParams.isActive !== undefined) {
            (this.query as any).isActive = this.queryParams.isActive;
        }

        // Handle search
        if (this.queryParams.search && searchFields.length > 0) {
            const searchRegex = new RegExp(this.queryParams.search, 'i');
            this.query.$or = searchFields.map((field) => ({
                [field]: searchRegex,
            })) as FilterQuery<T>['$or'];
        }

        // Merge other filters
        this.query = { ...this.query, ...queryObj };

        return this;
    }

    sort(): { sort: any } {
        const sortBy = this.queryParams.sortBy || 'createdAt';
        const sortOrder = this.queryParams.sortOrder === 'asc' ? 1 : -1;
        return { sort: { [sortBy]: sortOrder } };
    }

    async exec(): Promise<PaginatedResponse<T>> {
        const page = Number(this.queryParams.page) || 1;
        const limit = Number(this.queryParams.limit) || 10;
        const skip = (page - 1) * limit;

        const sortOptions = this.sort().sort;

        const [docs, totalDocs] = await Promise.all([
            this.model.find(this.query).sort(sortOptions).skip(skip).limit(limit).lean<T[]>(),
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
        };
    }
}
