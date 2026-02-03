/**
 * Pagination Type Definitions
 * 
 * Note: mongoose-paginate-v2 does NOT export PaginateOptions directly.
 * See mongoose-pagination.d.ts for proper type definitions.
 * This file provides our own strongly-typed interfaces for better control.
 */

/**
 * Generic Paginated Response
 * Matches mongoose-paginate-v2 structure but with cleaner property names
 */
export interface PaginatedResponse<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
    pagingCounter: number;
}

/**
 * Query parameters for pagination
 */
export interface PaginationQuery {
    page?: number | string;
    limit?: number | string;
    sort?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    populate?: string;
    select?: string;
}

/**
 * Advanced pagination options with filtering
 */
export interface PaginationOptions {
    page?: number;
    limit?: number;
    sort?: object | string;
    populate?: string | object | Array<string | object>;
    select?: string | object;
    lean?: boolean;
    leanWithId?: boolean;
}

/**
 * Convert PaginateResult to PaginatedResponse
 */
export function toPaginatedResponse<T>(result: any): PaginatedResponse<T> {
    const docs = (result.docs || []).map((doc: any) => {
        if (doc && typeof doc === 'object') {
            const cleanDoc = { ...doc };
            delete cleanDoc.__v;
            return cleanDoc;
        }
        return doc;
    });

    return {
        docs,
        totalDocs: result.totalDocs || 0,
        limit: result.limit || 10,
        page: result.page ?? 1,
        totalPages: result.totalPages || 0,
        hasNextPage: result.hasNextPage || false,
        hasPrevPage: result.hasPrevPage || false,
        nextPage: result.nextPage || null,
        prevPage: result.prevPage || null,
        pagingCounter: result.pagingCounter ?? 1,
    };
}

/**
 * Parse and normalize pagination query parameters
 */
export function parsePaginationQuery(query: PaginationQuery): PaginationOptions {
    const page = parseInt(String(query.page || 1));
    const limit = parseInt(String(query.limit || 10));

    const options: PaginationOptions = {
        page: page > 0 ? page : 1,
        limit: limit > 0 && limit <= 100 ? limit : 10,
        lean: true,
        leanWithId: false,
    };

    // Handle sorting
    if (query.sort) {
        options.sort = query.sort;
    } else if (query.sortBy) {
        const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
        options.sort = { [query.sortBy]: sortOrder };
    } else {
        options.sort = { createdAt: -1 }; // Default sort
    }

    // Handle population
    if (query.populate) {
        options.populate = Array.isArray(query.populate)
            ? query.populate
            : query.populate.split(',');
    }

    // Handle field selection
    if (query.select) {
        options.select = query.select;
    } else {
        // Exclude version key by default if no selection provided
        options.select = '-__v';
    }

    return options;
}

/**
 * Default pagination options
 */
export const DEFAULT_PAGINATION: PaginationOptions = {
    page: 1,
    limit: 10,
    lean: true,
    leanWithId: false,
    sort: { createdAt: -1 },
};
