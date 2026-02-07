import { Request } from "express";
import { tokenService } from "../services/token.service";
import APIError from "../error/api-error";

export async function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<any> {
  if (securityName === "jwt") {
    let tokenStr = request.headers["authorization"];
    let token = "";

    if (tokenStr) {
      token = tokenStr.replace("Bearer ", "");
    }
    // Check cookies if not in header
    else if (request.cookies && request.cookies["access_token"]) {
      token = request.cookies["access_token"];
    }

    if (!token) {
      return Promise.reject(new APIError("No token provided", 401));
    }

    try {
      const payload = tokenService.verifyAccessToken(token);
      return { userId: payload.userId, roles: payload.roles };
    } catch (error) {
      return Promise.reject(new APIError("Invalid token", 401));
    }
  }
  return Promise.reject(new APIError("Unknown security name", 400));
}