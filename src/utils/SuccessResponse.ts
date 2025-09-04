// Success response structure
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