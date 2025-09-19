import {
    Body, Controller, Post, Route, Tags, Response, Middlewares,
    Example,
    Get,
    NoSecurity
  } from 'tsoa';
  import { StatusCodes } from 'http-status-codes/build/cjs';
  import { validateSchemaMiddleware } from '../../middleware/common-validate';
;
  import { ErrorResponse } from '../../types/common.types';
  import { ClientErrorInterface } from '../../error/clientErrorHelper';
  import { NOT_FOUND_ERROR_EXAMPLE, SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from '../../error/exampleErrors';
  import { success, SuccessResponse } from '../../utils/SuccessResponse';
  import { AuthService } from '../../services/auth.service';
import { AuthTokens, CreateAdminRequest, IAuthResponse, LoginRequest, UserProfile } from '../../types/auth.types';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth';
import { createAdminSchema } from '../../validations/admin.validation';
import { AdminService } from '../../services/admin.service';
import { IAdminDocument } from '../../models/AdminModel';

  
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
     */
    @Post('create-admin')
    @Middlewares([ validateSchemaMiddleware(createAdminSchema, 'body')])
    public async createAdmin(
      @Body() body: CreateAdminRequest,

    ): Promise<SuccessResponse<UserProfile>> {
      const adminUser = await AuthService.createAdmin(body);
      // Optionally, login the new admin and return tokens
      return success(
        adminUser,
        'Admin created successfully',
      );
    }
    @Post('login')
    @Example({
      body: {
        "email": "milqit@gmail.com",
        "password": "Milqit@123"
      }})
    public async login (
      @Body() body: LoginRequest,
    ): Promise<SuccessResponse<{ user: UserProfile; tokens: AuthTokens }>> {
      const { user, tokens } = await AdminService.login(body);
      return success(
       { user, tokens },
        'Login successful',
      );
    }

  

    @Get('/users-list')
    // @Middlewares([jwtAuthMiddleware])
    @NoSecurity()
    public async listUsers(): Promise<SuccessResponse<UserProfile[]>> {
      const users = await AdminService.listUsers();
      return success(users || [], 'Users fetched successfully');
    }

    @Get('/admin-users')
    // @Middlewares([jwtAuthMiddleware])
    @NoSecurity()
    public async adminlistUsers(): Promise<SuccessResponse<UserProfile[]>> {
      const users = await AdminService.listAdminUsers();
      return success(users || [], 'Users fetched successfully');
    }
    

  }