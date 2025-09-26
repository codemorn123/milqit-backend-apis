import Joi from "joi";

export interface SuccessResponse<T> {
	success: true;
	message: string;
	result: T;
}

export const success = <T>(data: T, message?: string): SuccessResponse<T> => ({
	success: true,
	message: message || 'Success',
	result: data
});


export const successNull = (message?: string): SuccessResponse<null> => ({
  success: true,
  message: message || 'Success',
  result: null
})

export const errorSuccess = (message: Joi.ValidationError): SuccessResponse<null> => ({
  success: true,
  message: message.message,
  result: null
})
export type NullSuccessResponse = SuccessResponse<null>;


export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedList<Item = any> {
  data: Item[];
  meta: Pagination;
}
