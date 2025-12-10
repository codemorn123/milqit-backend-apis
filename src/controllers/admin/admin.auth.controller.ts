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
import { ClientErrorInterface } from '../../error/clientErrorHelper';
import { NOT_FOUND_ERROR_EXAMPLE, SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from '../../error/exampleErrors';
import { success, SuccessResponse } from '../../utils/SuccessResponse';
import { AuthService } from '../../services/auth.service';
import { AuthTokens, CreateAdminRequest, LoginRequest, UserProfile } from '../../types/auth.types';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';
import { createAdminSchema } from '../../validations/admin.validation';
import { AdminService } from '../../services/admin.service';
import { IUser } from '../../models/UserModel';
import APIError from '../../error/api-error';
import { logger } from '../../config/logger';



@Route('admin')
@Tags('Admin Management')
@Response<ClientErrorInterface>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found', NOT_FOUND_ERROR_EXAMPLE)
@Response<ErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request')
@Response<ErrorResponse>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
export class AdminController extends Controller {
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
    try {
      // Validate request body
      if (!body.email || !body.password) {
        this.setStatus(400);
        throw new APIError('Email and password are required', 400);
      }

      if (!body.name || body.name.trim().length === 0) {
        this.setStatus(400);
        throw new APIError('Name is required', 400);
      }

      // Create admin
      const adminUser = await AuthService.createAdmin(body);

      logger.info({ adminEmail: body.email }, 'Admin created successfully');

      this.setStatus(201);
      return success(
        adminUser,
        'Admin account created successfully'
      );
    } catch (error: any) {
      logger.error(
        {
          adminEmail: body.email,
          errorMessage: error.message,
          errorName: error.name,
          statusCode: error instanceof APIError ? error.getStatusCode() : 500
        },
        'Error creating admin'
      );
      this.setStatus(error instanceof APIError ? error.getStatusCode() : 500);
      throw error;
    }
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
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Response(StatusCodes.UNAUTHORIZED, "Invalid Credentials")
  public async login(
    @Body() body: LoginRequest
  ): Promise<SuccessResponse<{ user: UserProfile; tokens: AuthTokens }>> {
    try {
      // Validate request body
      if (!body.email || !body.email.trim()) {
        this.setStatus(400);
        throw new APIError('Email is required', 400);
      }

      if (!body.password || !body.password.trim()) {
        this.setStatus(400);
        throw new APIError('Password is required', 400);
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        this.setStatus(400);
        throw new APIError('Invalid email format', 400);
      }

      // Attempt login
      const { user, tokens } = await AdminService.login(body);

      logger.info({ adminId: user.id, email: body.email }, 'Admin logged in successfully');

      this.setStatus(200);
      return success(
        { user, tokens },
        'Login successful'
      );
    } catch (error: any) {
      logger.error(
        {
          email: body.email,
          errorMessage: error.message,
          errorName: error.name,
          statusCode: error instanceof APIError ? error.getStatusCode() : 500
        },
        'Admin login failed'
      );
      this.setStatus(error instanceof APIError ? error.getStatusCode() : 500);
      throw error;
    }
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
    try {
      // Validate pagination parameters
      if (queryParams.page && queryParams.page < 1) {
        this.setStatus(400);
        throw new APIError('Page number must be greater than 0', 400);
      }

      if (queryParams.limit && (queryParams.limit < 1 || queryParams.limit > 100)) {
        this.setStatus(400);
        throw new APIError('Limit must be between 1 and 100', 400);
      }

      // Fetch customers
      const users = await AdminService.listCustomers(queryParams);

      logger.info(
        { page: queryParams.page, limit: queryParams.limit, total: users.totalDocs },
        'Customer list fetched'
      );

      this.setStatus(200);
      return success(users, 'Customers fetched successfully');
    } catch (error: any) {
      logger.error(
        {
          page: queryParams.page,
          limit: queryParams.limit,
          errorMessage: error.message,
          errorName: error.name,
          statusCode: error instanceof APIError ? error.getStatusCode() : 500
        },
        'Error fetching customer list'
      );
      this.setStatus(error instanceof APIError ? error.getStatusCode() : 500);
      throw error;
    }
  }

  /**
   * Get list of all admin users
   * Requires admin authentication and super admin privileges
   */
  @Get('/admin-users')
  @Security('jwt')
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  public async adminlistUsers(): Promise<SuccessResponse<UserProfile[]>> {
    try {
      // Fetch admin users
      const users = await AdminService.listAdminUsers();

      logger.info({ count: users.length }, 'Admin users list fetched');

      this.setStatus(200);
      return success(users, 'Admin users fetched successfully');
    } catch (error: any) {
      logger.error(
        {
          errorMessage: error.message,
          errorName: error.name,
          statusCode: error instanceof APIError ? error.getStatusCode() : 500
        },
        'Error fetching admin users list'
      );
      this.setStatus(error instanceof APIError ? error.getStatusCode() : 500);
      throw error;
    }
  }


  /**
   * Refresh authentication tokens
   * @param body Refresh token
   */
  @Post('refresh-token')
  @NoSecurity()
  @TsoaSuccessResponse(StatusCodes.OK, "Success")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  @Response(StatusCodes.UNAUTHORIZED, "Invalid Token")
  public async refreshToken(
    @Body() body: { refreshToken: string }
  ): Promise<SuccessResponse<{ tokens: AuthTokens }>> {
    try {
      const result = await AuthService.refreshToken(body);
      return success(result, 'Tokens refreshed successfully');
    } catch (error: any) {
      this.setStatus(error instanceof APIError ? error.getStatusCode() : 500);
      throw error;
    }
  }
}