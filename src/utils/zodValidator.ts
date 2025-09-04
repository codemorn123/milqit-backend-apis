import { z } from 'zod';
import { ApiError } from './errorHandler';

/**
 * Format a Zod validation error path
 * Handles strings, numbers, and symbols in the path
 */
function formatZodPath(path: PropertyKey[]): string {
  return path.map(p => {
    if (typeof p === 'number') {
      return `[${p}]`;
    } else if (typeof p === 'symbol') {
      return `[${String(p)}]`;
    } else {
      return p;
    }
  }).join('.');
}

/**
 * Validates data against a Zod schema and returns the validated data
 * Throws an ApiError with validation details if validation fails
 */
export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Updated to use issues instead of errors (Zod v3.22.4+)
      const formattedErrors = error.issues.map(issue => ({
        path: formatZodPath(issue.path),
        message: issue.message,
        code: issue.code
      }));
      throw ApiError.validation(formattedErrors);
    }
    throw error;
  }
}


export async function validateAsync<T>(
  schema: z.ZodType<T>, 
  data: unknown
): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Updated to use issues instead of errors (Zod v3.22.4+)
      const formattedErrors = error.issues.map(issue => ({
        path: formatZodPath(issue.path),
        message: issue.message,
        code: issue.code
      }));
      throw ApiError.validation(formattedErrors);
    }
    throw error;
  }
}

/**
 * Safely validates data against a Zod schema
 * Returns a result object with success status and either data or error
 */
export function validateSafe<T>(
  schema: z.ZodType<T>, 
  data: unknown
): { success: true; data: T } | { success: false; errors: Array<{ path: string; message: string; code?: string }> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return result;
  }
  
  // Updated to use issues instead of errors (Zod v3.22.4+)
  const errors = result.error.issues.map(issue => ({
    path: formatZodPath(issue.path),
    message: issue.message,
    code: issue.code
  }));
  
  return { success: false, errors };
}