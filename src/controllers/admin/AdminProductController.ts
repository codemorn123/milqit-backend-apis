import {
  Body, Controller, Post, Get, Put, Delete, Path, Query, Route, Tags, Security, UploadedFiles, Middlewares, FormField,
  Response,
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { productService } from '../../services/productService';
import { createProductSchema, getProductsSchema, updateProductSchema } from '../../schemas/product.schema';
import { success, SuccessResponse, NullSuccessResponse } from '../../utils/SuccessResponse';
import { validate } from '../../middleware/validation.middleware';
import { 
  CreateProductDTO, UpdateProductDTO,
  toProductResponseDTO, toPaginatedProductsResponseDTO,
  ProductResponseDTO, PaginatedProductsResponseDTO,
} from './../../dto/product.dto';
import { ErrorResponse } from './../../types/common.types';

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
@Middlewares(validate(createProductSchema))
public async createProduct(
  @FormField() name: string,
  @FormField() price: number,
  @FormField() categoryId: string,
  @FormField() sku: string,
  @FormField() quantity: number,
  @FormField() unit: 'piece' | 'kg' | 'gm' | 'litre' | 'ml' | 'pack' | 'dozen',
  @FormField() description?: string,
  @FormField() brand?: string,
  @FormField() isActive?: boolean,
  @UploadedFiles('images') files?: Express.Multer.File[],
): Promise<SuccessResponse<ProductResponseDTO>> {
  const data: CreateProductDTO = {
    name,
    price,
    categoryId,
    sku,
    quantity,
    unit,
    description,
    brand,
    isActive: isActive ?? true,
  };

  const product = await productService.create(data, files || []);
  this.setStatus(StatusCodes.CREATED);
  return success(toProductResponseDTO(product), 'Product created successfully.');
}

  @Put('{id}')
  @Middlewares(validate(updateProductSchema))
  public async updateProduct(
    @Path() id: string,
    @Body() data: UpdateProductDTO
  ): Promise<SuccessResponse<ProductResponseDTO>> {
    const product = await productService.update(id, data);
    return success(toProductResponseDTO(product), 'Product updated successfully.');
  }

  /**
   * Get a paginated list of products.
   * @summary Authored by MarotiKathoke at 2025-09-01 10:32:19
   */
  @Get('/')
  @Middlewares(validate(getProductsSchema))
  public async getProducts(
    @Query() page?: number,
    @Query() limit?: number,
    @Query() sortBy?: string,
    @Query() sortOrder?: 'asc' | 'desc',
    @Query() search?: string,
    @Query() isActive?: boolean
  ): Promise<SuccessResponse<PaginatedProductsResponseDTO>> {
    const paginatedResult = await productService.find({ page, limit, sortBy, sortOrder, search, isActive });
    return success(toPaginatedProductsResponseDTO(paginatedResult), 'Products fetched successfully.');
  }

  /**
   * Get a single product by its ID.
   * @summary Authored by MarotiKathoke at 2025-09-01 10:32:19
   */
  @Get('{id}')
  public async getProductById(@Path() id: string): Promise<SuccessResponse<ProductResponseDTO>> {
    const product = await productService.findById(id);
    return success(toProductResponseDTO(product), 'Product fetched successfully.');
  }

  /**
   * Delete a product by its ID.
   * @summary Authored by MarotiKathoke at 2025-09-01 10:32:19
   */
  @Delete('{id}')
  public async deleteProduct(@Path() id: string): Promise<NullSuccessResponse> {
    await productService.remove(id);
    this.setStatus(StatusCodes.NO_CONTENT);
    return success(null, 'Product deleted successfully.');
  }
}