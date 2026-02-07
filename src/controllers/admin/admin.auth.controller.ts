import {
  Body, Controller, Post, Route, Tags, Response, Middlewares,
  Example,
  Get,
  NoSecurity,
  Queries,
  Security,
  SuccessResponse as TsoaSuccessResponse,
  Request
} from 'tsoa';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { StatusCodes } from 'http-status-codes';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { ErrorResponse, IFilter, PaginatedResponse } from '../../types/common.types';
import { NOT_FOUND_ERROR_EXAMPLE, SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from '../../error/exampleErrors';
import { SuccessResponse } from '../../utils/SuccessResponse';
import { AuthService } from '../../services/auth.service';
import { AuthTokens, CreateAdminRequest, LoginRequest, UserProfile } from '../../types/auth.types';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';
import { createAdminSchema, loginSchema, refreshTokenSchema } from '../../validations/admin.validation';
import { AdminService } from '../../services/admin.service';
import { IUser } from '../../models/UserModel';
import { logger } from '../../config/logger';
import { AdminUserService } from '../../services/admin/admin.users.service';
import CookieHelper from '../../utils/cookie.helper';
import { AdminControllerResponses } from '../../constants/response-decorators';
import { BaseController } from '../base.controller';

@Route('admin')
@Tags('Admin Management')
@AdminControllerResponses()
export class AdminController extends BaseController {
  private adminUserService = new AdminUserService();

  /**
   * Create a new admin account. Only admins can create new admin accounts.
   * Requires authentication and proper admin privileges.
   */
  @Post('create-admin')
  // @Security('jwt')
  @Middlewares([validateSchemaMiddleware(createAdminSchema, 'body')])
  @TsoaSuccessResponse(StatusCodes.CREATED, "Created")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  public async createAdmin(
    @Body() body: CreateAdminRequest
  ): Promise<SuccessResponse<UserProfile>> {
    // Validation handled by middleware
    // Create admin
    const adminUser = await AuthService.createAdmin(body);
    logger.info({ adminEmail: body.email }, 'Admin created successfully');
    return this.sendCreated(adminUser, 'Admin account created successfully');
  }

  /**
   * Admin login endpoint
   * Returns user profile and authentication tokens
   * Sets HTTP-only cookies for secure authentication (Web only)
   */
  @Post('login')
  @NoSecurity()
  @Example({
    body: {
      "email": "admin@milqit.com",
      "password": "SecurePassword@123",
      "platform": "web"
    }
  })
  @Middlewares([validateSchemaMiddleware(loginSchema, 'body')])
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Response(StatusCodes.UNAUTHORIZED, "Invalid Credentials")
  public async login(
    @Body() body: LoginRequest,
    @Request() request: ExpressRequest
  ): Promise<SuccessResponse<{ user: UserProfile; tokens: AuthTokens }>> {
    const { user, tokens } = await AdminService.login(body);

    const platform = body.platform || 'web'; // Default to web for backward compatibility with admin panel

    // Set HTTP-only cookies only for web platform
    if (platform === 'web') {
      const res = request.res as ExpressResponse;
      if (res) {
        CookieHelper.setAuthTokens(
          res,
          tokens.accessToken,
          tokens.refreshToken,
          tokens.expiresIn
        );
      }
    }

    logger.info({ adminId: user._id, email: body.email, platform }, 'Admin logged in successfully');
    return this.sendSuccess({ user, tokens }, 'Login successful');
  }

  /**
   * Get paginated list of customers
   * Requires admin authentication
   */
  @Get('/customer-list')
  @Security('jwt')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Invalid Query Params")
  public async listUsers(
    @Queries() queryParams: IFilter
  ): Promise<SuccessResponse<PaginatedResponse<IUser>>> {
    const users = await this.adminUserService.getUsersPaginated(queryParams);
    return this.sendPaginated(users, 'Customers fetched successfully');
  }

  /**
   * Get list of all admin users
   * Requires admin authentication and super admin privileges
   */
  @Get('/admin-users')
  @Security('jwt')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  public async adminlistUsers(): Promise<SuccessResponse<UserProfile[]>> {
    const users = await AdminService.listAdminUsers();
    return this.sendSuccess(users, 'Admin users fetched successfully');
  }

  /**
   * Refresh authentication tokens
   * Supports both body-based (mobile) and cookie-based (web) refresh tokens
   */
  @Post('refresh-token')
  @NoSecurity()
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Response(StatusCodes.UNAUTHORIZED, "Invalid Token")
  public async refreshToken(
    @Request() request: ExpressRequest,
    @Body() body: { refreshToken?: string; platform?: 'mobile' | 'web' } = {}
  ): Promise<SuccessResponse<{ tokens: AuthTokens }>> {
    // Get refresh token from cookie or body
    const refreshToken = CookieHelper.getRefreshToken(request) || body.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    const result = await AuthService.refreshToken({ refreshToken });
    const platform = body.platform || 'web';

    // Update cookies if response object is available and platform is web
    if (platform === 'web') {
      const res = request.res as ExpressResponse;
      if (res) {
        CookieHelper.setAuthTokens(
          res,
          result.tokens.accessToken,
          result.tokens.refreshToken,
          result.tokens.expiresIn
        );
      }
    }

    return this.sendSuccess(result, 'Tokens refreshed successfully');
  }

  /**
   * Logout - Clear authentication cookies
   */
  @Post('logout')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  public async logout(
    @Request() request: ExpressRequest
  ): Promise<SuccessResponse<null>> {
    const res = request.res as ExpressResponse;
    if (res) {
      CookieHelper.clearAuthTokens(res);
    }
    return this.sendSuccess(null, 'Logged out successfully');
  }
}