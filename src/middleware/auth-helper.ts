import { Request } from "express";

export async function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<any> {
  if (securityName === "jwt") {
    // get token from header
    const token = request.headers["authorization"];
    // validate token logic here...
    if (!token) throw new Error("No JWT token");

    // Return user or throw error
    return { userId: "demo" };
  }
  throw new Error("Unknown security name: " + securityName);
}