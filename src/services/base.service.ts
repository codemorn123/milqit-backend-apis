import { Model, Document } from 'mongoose';
import { IFilter, PaginatedResponse } from '../types/common.types';
import { QueryBuilder } from '../utils/query-builder';
import APIError from '../error/api-error';

export abstract class BaseService<T> {
    constructor(
        protected readonly model: Model<T>,
        protected readonly searchFields: string[] = []
    ) { }

    async create(data: Partial<T>): Promise<T> {
        const doc = await this.model.create(data);
        return doc;
    }

    async getAll(queryParams: IFilter): Promise<PaginatedResponse<T>> {
        const builder = new QueryBuilder(this.model, queryParams);
        return builder.filter(this.searchFields).exec();
    }

    async getOne(id: string): Promise<T> {
        const doc = await this.model.findById(id).lean<T>();
        if (!doc) {
            throw new APIError('Document not found', 404);
        }
        return doc;
    }

    async update(id: string, data: Partial<T>): Promise<T> {
        const doc = await this.model.findByIdAndUpdate(id, data, { new: true }).lean<T>();
        if (!doc) {
            throw new APIError('Document not found', 404);
        }
        return doc;
    }

    async delete(id: string): Promise<{ message: string; status: number }> {
        const doc = await this.model.findByIdAndDelete(id);
        if (!doc) {
            throw new APIError('Document not found', 404);
        }
        return { message: 'Document deleted successfully', status: 200 };
    }
}
