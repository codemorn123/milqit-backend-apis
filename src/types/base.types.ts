import { Request, Response } from 'express';

// Placeholder for CommonArea if not defined elsewhere
export type CommonArea = any;

export interface BaseRequest extends Request {
    gid?: string;
    commons?: CommonArea;
}

export interface BaseResponse extends Response {
    gid?: string;
    commons?: CommonArea;
}
