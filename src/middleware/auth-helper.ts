import { Request } from "express";
import { tokenService } from "../services/token.service";
import APIError from "../error/api-error";

export async function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<any> {
  if (securityName === "jwt") {
    const authHeader = request.headers["authorization"];
    if (!authHeader) {
      return Promise.reject(new APIError("No token provided", 401));
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      const payload = tokenService.verifyAccessToken(token);
      return { userId: payload.userId, roles: payload.roles };
    } catch (error) {
      return Promise.reject(new APIError("Invalid token", 401));
    }
  }
  return Promise.reject(new APIError("Unknown security name", 400));
}