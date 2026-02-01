import {
  Body, Controller, Post, Route, Tags, Response, Middlewares,
  Example,
  Get,
  NoSecurity,
  Queries,
  Security,
  SuccessResponse as TsoaSuccessResponse
} from 'tsoa';
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



import { BaseController } from '../base.controller';

@Route('admin')
@Tags('Admin Management')
@Response<ErrorResponse>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ErrorResponse>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
@Response<ErrorResponse>(StatusCodes.NOT_FOUND, 'Not Found', NOT_FOUND_ERROR_EXAMPLE)
@Response<ErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request')
@Response<ErrorResponse>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
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
   */
  @Post('login')
  @NoSecurity()
  @Example({
    body: {
      "email": "admin@milqit.com",
      "password": "SecurePassword@123"
    }
  })
  @Middlewares([validateSchemaMiddleware(loginSchema, 'body')])
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Response(StatusCodes.UNAUTHORIZED, "Invalid Credentials")
  public async login(
    @Body() body: LoginRequest
  ): Promise<SuccessResponse<{ user: UserProfile; tokens: AuthTokens }>> {
    // Attempt login
    const { user, tokens } = await AdminService.login(body);

    logger.info({ adminId: user.id, email: body.email }, 'Admin logged in successfully');
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
   * @param body Refresh token
   */
  @Post('refresh-token')
  @NoSecurity()
  @Middlewares([validateSchemaMiddleware(refreshTokenSchema, 'body')])
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Response(StatusCodes.UNAUTHORIZED, "Invalid Token")
  public async refreshToken(
    @Body() body: { refreshToken: string }
  ): Promise<SuccessResponse<{ tokens: AuthTokens }>> {
    const result = await AuthService.refreshToken(body);
    return this.sendSuccess(result, 'Tokens refreshed successfully');
  }
}