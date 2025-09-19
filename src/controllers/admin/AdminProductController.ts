import {
  Body, Controller, Post, Get, Put, Delete, Path, Route, Tags, Middlewares,
  Response,
  Example,
  Queries,
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { productService } from '../../services/product.service';
import productSchema, { createProductSchema, getProductsSchema, productIdSchema, updateProductSchema } from '../../schemas/product.schema';
import { success, SuccessResponse, NullSuccessResponse } from '../../utils/SuccessResponse';
import { ErrorResponse, PaginatedResponse } from './../../types/common.types';
import { IProduct, ProductDocument } from './../../models/ProductModel';
import { ProductFilterQueryParams } from './../../types/product.types';
import { validateSchemaMiddleware } from './../../middleware/common-validate';
import { idParamSchema } from './../../constants/common.validator';

@Tags('ADMIN: Products')
@Route('admin/products')
// @Security('jwt', ['admin'])
@Response<ErrorResponse>(400, "Bad Request")
@Response<ErrorResponse>(401, "Unauthorized")
@Response<ErrorResponse>(403, "Forbidden")
@Response<ErrorResponse>(404, "Not Found")
@Response<ErrorResponse>(409, "Conflict")
@Response<ErrorResponse>(422, "Validation Error")
@Response<ErrorResponse>(500, "Server Error")
export class AdminProductController extends Controller {
  /**
   * Create a new product with file uploads.
   * Note: When uploading files, data must be sent as form fields.
   * @summary Authored by MarotiKathoke at 2025-09-01 10:32:19
   */
  @Post('/')
  // @Middlewares(validate(createProductSchema))
  @Example({
    name: 'Product Name',
    price: 100,
    categoryId: '123456789012345678901234',
    sku: '123456789012345678901234',
    quantity: 10,
    unit: 'piece',
    description: 'Product description',
    brand: 'Brand name',
    isActive: true,
    images: ['image1.jpg', 'image2.jpg'],


  })

  @Middlewares([validateSchemaMiddleware(createProductSchema, "body")])
  public async createProduct(
    @Body() data: IProduct
  ): Promise<SuccessResponse<IProduct>> {
    const product = await productService.create(data);
    this.setStatus(StatusCodes.CREATED);
    return success(product, 'Product created successfully.');
  }

  @Put('{id}')
  @Middlewares(validateSchemaMiddleware(updateProductSchema,'body'))
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async updateProduct(
    @Path() id: string,
    @Body() data: IProduct
  ): Promise<SuccessResponse<IProduct>> {
    const product = await productService.update(id, data);
    return success(product, 'Product updated successfully.');
  }

  /**
   * Get a paginated list of products.
   * @summary Authored by MarotiKathoke at 2025-09-01 10:32:19
   */
  @Get('/')
  // @Middlewares(validate(getProductsSchema))
  public async getProducts(
    @Queries() filter: ProductFilterQueryParams
  ): Promise<SuccessResponse<PaginatedResponse<IProduct>>> {
    const paginatedResult = await productService.find(filter);
    return success(paginatedResult, 'Products fetched successfully.');
  }

  /**
   * Get a single product by its ID.
   * @summary Authored by MarotiKathoke at 2025-09-01 10:32:19
   */
  @Get('{id}')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async getProductById(@Path() id: string): Promise<SuccessResponse<IProduct>> {
    const product = await productService.findById(id);
    return success(product, 'Product fetched successfully.');
  }

  /**
   * Delete a product by its ID.
   * @summary Authored by MarotiKathoke at 2025-09-01 10:32:19
   */
  @Delete('{id}')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async deleteProduct(@Path() id: string): Promise<NullSuccessResponse> {
    await productService.remove(id);
    this.setStatus(StatusCodes.NO_CONTENT);
    return success(null, 'Product deleted successfully.');
  }
}