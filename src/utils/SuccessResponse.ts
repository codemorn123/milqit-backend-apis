// Success response structure
import { StatusCodes } from 'http-status-codes/build/cjs';
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




// interface ApiResponse<T> {
//   data: T;
//   meta?: Pagination;
//   isAppError?: boolean;
// }

// export abstract class BaseResponse<T> {
//   protected abstract statusCode: StatusCodes;

//   protected abstract apiResponse: ApiResponse<T>;

//   constructor(private res: Response) {}

//   send = () => this.res.status(this.statusCode).json(this.apiResponse);
// }

// export class ListResponse<T> extends BaseResponse<T> {
//   protected statusCode = StatusCodes.OK;

//   protected apiResponse = {
//     meta: this.meta,
//     data: this.data,
//   };

//   constructor(res: Response, private data: T, private meta: Pagination) {
//     super(res);
//   }
// }