// Example: How to migrate a controller to the new system

// ================== BEFORE ==================
import { Controller, Route, Tags, Response, Get, Post } from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { ClientErrorInterface } from '../error/clientErrorHelper';
import { ErrorResponse } from '../types/common.types';

@Route('customer/products')
@Tags('Products')
@Response<ClientErrorInterface>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ClientErrorInterface>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found')
@Response<ClientErrorInterface>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error')
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error')
export class ProductController extends Controller {

    @Get()
    public async getProducts() {
        const products = await productService.findAll();
        this.setStatus(200);
        return success(products, 'Products fetched successfully');
    }

    @Post()
    public async createProduct(@Body() body: IProduct) {
        const product = await productService.create(body);
        this.setStatus(201);
        return success(product, 'Product created successfully');
    }
}


// ================== AFTER ==================
import { Route, Tags, Get, Post } from 'tsoa';
import { BaseController } from '../base.controller';
import { CustomerControllerResponses } from '../constants/response-decorators';
import { SUCCESS_MESSAGES } from '../constants/response-messages';

@Route('customer/products')
@Tags('Products')
@CustomerControllerResponses()  // ✅ Replaces 5 @Response decorators!
export class ProductController extends BaseController {

    @Get()
    public async getProducts() {
        const products = await productService.findAll();
        return this.sendSuccess(products, SUCCESS_MESSAGES.FETCHED);  // ✅ Clean & consistent!
    }

    @Post()
    public async createProduct(@Body() body: IProduct) {
        const product = await productService.create(body);
        return this.sendCreated(product, SUCCESS_MESSAGES.CREATED);  // ✅ Automatic 201 status!
    }
}


// ================== BENEFITS ==================
/*
1. ✅ 70% less code
2. ✅ No manual status codes
3. ✅ Consistent messages
4. ✅ Type-safe constants
5. ✅ Easy to maintain
6. ✅ Autocomplete support
*/


// ================== MORE EXAMPLES ==================

// Example: Admin Controller with Conflict
import { AdminControllerResponses } from '../constants/response-decorators';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/response-messages';

@Route('admin/users')
@Tags('Admin - Users')
@Security('jwt', ['admin'])
@AdminControllerResponses()  // Includes 409 Conflict response
export class AdminUsersController extends BaseController {

    @Post()
    public async createUser(@Body() body: IUserInput) {
        const existing = await userService.findByEmail(body.email);
        if (existing) {
            throw new APIError(ERROR_MESSAGES.EMAIL_ALREADY_REGISTERED, 409);
        }
        const user = await userService.create(body);
        return this.sendCreated(user, SUCCESS_MESSAGES.USER_CREATED);
    }

    @Get('{id}')
    public async getUser(@Path() id: string) {
        const user = await userService.findById(id);
        if (!user) {
            throw new APIError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
        }
        return this.sendSuccess(user, SUCCESS_MESSAGES.RETRIEVED);
    }

    @Delete('{id}')
    public async deleteUser(@Path() id: string) {
        await userService.delete(id);
        return this.sendResponse(SUCCESS_MESSAGES.USER_DELETED);
    }
}


// Example: Public Controller (minimal responses)
import { PublicControllerResponses } from '../constants/response-decorators';

@Route('public/categories')
@Tags('Public API')
@PublicControllerResponses()  // Only essential error responses
export class PublicCategoryController extends BaseController {

    @Get()
    public async getCategories() {
        const categories = await categoryService.findAll();
        return this.sendSuccess(categories, SUCCESS_MESSAGES.FETCHED);
    }
}


// Example: Custom combination
import { StandardErrorResponses, ConflictResponse } from '../constants/response-decorators';

@Route('resources')
@Tags('Resources')
@StandardErrorResponses()  // Base error responses
@ConflictResponse()        // Add conflict response
export class ResourceController extends BaseController {
    // ... methods
}
