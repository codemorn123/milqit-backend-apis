import { ZodError } from 'zod';
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserFiltersSchema,
  PaginationSchema,
  BulkUpdateSchema,
  UserIdSchema,
} from '../schemas/userSchemas';


export const validateCreateUser = (data: unknown) => CreateUserSchema.parseAsync(data);
export const validateUpdateUser = (data: unknown) => UpdateUserSchema.parseAsync(data);
export const validateUserFilters = (data: unknown) => UserFiltersSchema.parseAsync(data);
export const validatePagination = (data: unknown) => PaginationSchema.parseAsync(data);
export const validateBulkUpdate = (data: unknown) => BulkUpdateSchema.parseAsync(data);
export const validateUserId = (id: unknown) => UserIdSchema.parseAsync(id);

/**
 * Helper to format ZodError into a small details array consumed by controllers
 */
export function formatZodError(err: ZodError) {
  return err.issues.map((i) => ({
    path: i.path.length ? i.path.join('.') : '(root)',
    message: i.message,
    code: i.code,
  }));
}