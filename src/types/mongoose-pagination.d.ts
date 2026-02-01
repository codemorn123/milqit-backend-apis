/**
 * Type definitions for mongoose-paginate-v2
 * This file provides proper type exports since the library's types can be inconsistent
 */

import { Document, Model, Query } from 'mongoose';

declare module 'mongoose' {
    interface PaginateOptions {
        select?: object | string;
        collation?: object;
        sort?: object | string;
        populate?: Array<object> | Array<string> | object | string;
        projection?: any;
        lean?: boolean;
        leanWithId?: boolean;
        offset?: number;
        page?: number;
        limit?: number;
        customLabels?: object;
        pagination?: boolean;
        useEstimatedCount?: boolean;
        useCustomCountFn?: boolean;
        forceCountFn?: boolean;
        allowDiskUse?: boolean;
        read?: object;
        options?: object;
    }

    interface PaginateResult<T> {
        docs: T[];
        totalDocs: number;
        limit: number;
        page?: number;
        totalPages: number;
        nextPage?: number | null;
        prevPage?: number | null;
        pagingCounter: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        meta?: any;
        [customLabel: string]: T[] | number | boolean | null | undefined;
    }

    interface PaginateModel<T extends Document> extends Model<T> {
        paginate(
            query?: object,
            options?: PaginateOptions,
            callback?: (err: any, result: PaginateResult<T>) => void
        ): Promise<PaginateResult<T>>;
    }

    export function model<T extends Document>(
        name: string,
        schema?: Schema<T>,
        collection?: string,
        skipInit?: boolean
    ): PaginateModel<T>;
}

export { };
