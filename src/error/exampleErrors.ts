import { StatusCodes } from 'http-status-codes/build/cjs';
import { ClientErrorInterface } from './clientErrorHelper';

export const VALIDATION_ERROR_EXAMPLE: ClientErrorInterface = {
  success: false,
  code: 'VALIDATION_ERROR',
  status: StatusCodes.UNPROCESSABLE_ENTITY,
  message: 'string'
};

export const NOT_FOUND_ERROR_EXAMPLE: ClientErrorInterface = {
  success: false,
  code: 'NOT_FOUND',
  status: StatusCodes.NOT_FOUND,
  message: 'string'
};

export const SERVER_ERROR_EXAMPLE: ClientErrorInterface = {
  success: false,
  code: 'SERVER_ERROR',
  status: StatusCodes.INTERNAL_SERVER_ERROR,
  message: 'string'
};

export const UNAUTHORIZED_ERROR_EXAMPLE: ClientErrorInterface = {
  success: false,
  code: 'UNAUTHORIZED',
  status: StatusCodes.UNAUTHORIZED,
  message: 'string'
};