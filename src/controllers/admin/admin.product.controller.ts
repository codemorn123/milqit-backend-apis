import {
  Body, Controller, Post, Get, Put, Delete, Path, Route, Tags, Middlewares,
  Response,
  Example,
  Queries,
  UploadedFile,
  UploadedFiles,
  Consumes,
  FormField,
  SuccessResponse,
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { productService } from '../../services/product.service';
import { createProductSchema } from '../../schemas/product.schema';
import { success, SuccessResponse as CustomSuccessResponse, NullSuccessResponse } from '../../utils/SuccessResponse';
import { ErrorResponse, IProductFilter, PaginatedResponse } from '../../types/common.types';
import { IProduct, ProductType, ValidUnit } from '../../models/product.model';
import { CreateProductRequest, ProductFilterQueryParams } from '../../types/product.types';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { idParamSchema } from '../../constants/common.validator';
import APIError from '../../error/api-error';



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

   */
  @Post('/')
  // @Middlewares(validate(createProductSchema))
  @Example<CreateProductRequest>({
    name: "Fresh Organic Milk",
    description: "Premium quality organic milk from local farms",
    mrp: 100,
    sellingPrice: 85,
    unit: "litre",
    category: "60f7b3b3b3f1b40015c8e8a1",
    quantity: 50,
    productType: "Food",
    brand: "FreshFarm",
    sku: "FF-MILK-001",
    isActive: true,
    isFeatured: false,
    productDetails: JSON.stringify({
      fssaiLicenceNumber: "12345678901234",
      isVegetarian: true,
      shelfLife: "3 Days",
      keyFeatures: ["Organic", "Farm Fresh", "Rich in Calcium"]
    })
  })

  @Consumes("multipart/form-data")
  @SuccessResponse(StatusCodes.CREATED, "Created")
  @Response(StatusCodes.BAD_REQUEST, "Validation Failed")
  // @Middlewares([validateSchemaMiddleware(createProductSchema, "body")])
  public async createProduct(
    @FormField() name: string,
    @FormField() description: string,
    @FormField() mrp: number,
    @FormField() sellingPrice: number,
    @FormField() unit: ValidUnit,
    @FormField() category: string,
    @FormField() quantity: number,
    @FormField() productType: ProductType,
    @FormField() brand?: string,
    @FormField() sku?: string,
    @FormField() isActive?: boolean,
    @FormField() isFeatured?: boolean,
    @FormField() productDetails?: string, // JSON string that will be parsed
    @UploadedFiles("images") images?: Express.Multer.File[]

  ): Promise<CustomSuccessResponse<{}>> {

    const dataToValidate = {
      name,
      description,
      mrp,
      sellingPrice,
      unit,
      category,
      quantity,
      productType,
      brand,
      sku,
      isActive: isActive ?? true,
      isFeatured: isFeatured ?? false,
      productDetails: productDetails ? JSON.parse(productDetails) : {},
    };


    const { error, value } = createProductSchema.validate(dataToValidate);
    if (error) {
      console.warn('Validation error:', error);
      throw new APIError(error.details[0].message, 400);
    }

    // Additional validation: ensure category is a valid MongoDB ObjectId
    if (!value.category || !value.category.match(/^[0-9a-fA-F]{24}$/)) {
      throw new APIError(
        'Invalid category ID format. Category must be a valid MongoDB ObjectId, not a category name. Please provide the category ID (e.g., "507f1f77bcf86cd799439011")',
        400
      );
    }

    const product = await productService.createProduct(value, images);
    this.setStatus(StatusCodes.CREATED);

    return success(product, 'Product created successfully.');
  }

  @Put('{id}')
  @Consumes("multipart/form-data")
  @SuccessResponse(StatusCodes.OK, "Updated")
  public async updateProduct(
    @Path() id: string,
    @FormField() name?: string,
    @FormField() description?: string,
    @FormField() mrp?: number,
    @FormField() sellingPrice?: number,
    @FormField() unit?: ValidUnit,
    @FormField() category?: string,
    @FormField() quantity?: number,
    @FormField() productType?: ProductType,
    @FormField() brand?: string,
    @FormField() sku?: string,
    @FormField() isActive?: boolean,
    @FormField() isFeatured?: boolean,
    @FormField() productDetails?: string,
    @UploadedFiles("images") images?: Express.Multer.File[]
  ): Promise<CustomSuccessResponse<{}>> {
    const dataToUpdate: any = {
      name, description, mrp, sellingPrice, unit, category, quantity, productType, brand, sku, isActive, isFeatured
    };

    if (productDetails) {
      try {
        dataToUpdate.productDetails = JSON.parse(productDetails);
      } catch (e) {
        throw new APIError('Invalid productDetails JSON', 400);
      }
    }

    // Filter out undefined values
    Object.keys(dataToUpdate).forEach(key => dataToUpdate[key] === undefined && delete dataToUpdate[key]);

    const product = await productService.update(id, dataToUpdate, images);
    return success(product, 'Product updated successfully.');
  }


  @Get('/')
  public async getAllProducts(
    @Queries() filter: ProductFilterQueryParams
  ): Promise<CustomSuccessResponse<PaginatedResponse<IProduct>>> {
    const paginatedResult = await productService.listOfProducts(filter);
    return success(paginatedResult, 'Products fetched successfully.');
  }

  /**
   * Get a single product by its ID.
   * @summary Authored by MarotiKathoke at 2025-09-01 10:32:19
   */
  /**
   * Get a single product by its ID.
   * @summary Authored by MarotiKathoke at 2025-09-01 10:32:19
   */
  @Get('{id}')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async getProductById(@Path() id: string): Promise<CustomSuccessResponse<IProduct>> {
    const product = await productService.findById(id);
    return success(product, 'Product fetched successfully.');
  }

  /**
   * Get a single product by its Slug.
   */
  @Get('slug/{slug}')
  public async getProductBySlug(@Path() slug: string): Promise<CustomSuccessResponse<IProduct | null>> {
    const product = await productService.getProductBySlug(slug, false); // false = don't enforce public/active check for admin
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