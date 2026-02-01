import {
  Controller, Post, Get, Put, Delete, Path, Route, Tags, Middlewares,
  Response,
  Example,
  Queries,
  UploadedFiles,
  Consumes,
  FormField,
  SuccessResponse as SuccessResponseTags,
} from 'tsoa';
import { StatusCodes } from 'http-status-codes';
import { productService } from '../../services/product.service';
import { createProductSchema } from '../../schemas/product.schema';
import { SuccessResponse } from '../../utils/SuccessResponse';
import { ErrorResponse, PaginatedResponse } from '../../types/common.types';
import { IProduct, ProductType, ValidUnit } from '../../models/product.model';
import { CreateProductRequest, ProductFilterQueryParams } from '../../types/product.types';
import { validateSchemaMiddleware } from '../../middleware/common-validate';
import { idParamSchema } from '../../constants/common.validator';
import { BaseController } from '../base.controller';
import { handleValidationError, throwBadRequest } from '../../utils/error-helpers';
import { cleanObject } from '../../utils/object.utils';



@Tags('ADMIN: Products')
@Route('admin/products')
// @Security('jwt', ['admin'])
export class AdminProductController extends BaseController {
  /**
   * Create a new product with file uploads.
   * Note: When uploading files, data must be sent as form fields.
   *
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
  @SuccessResponseTags(StatusCodes.CREATED, "Created")
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

  ): Promise<SuccessResponse<{}>> {

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


    const cleanedData = cleanObject(dataToValidate);
    const { error, value } = createProductSchema.validate(cleanedData);
    if (error) handleValidationError(error);

    // Additional validation: ensure category is a valid MongoDB ObjectId
    if (!value.category || !value.category.match(/^[0-9a-fA-F]{24}$/)) {
      throwBadRequest('Invalid category ID format. Category must be a valid MongoDB ObjectId.');
    }

    const product = await productService.create(value, images);
    return this.sendCreated(product, 'Product created successfully.');
  }

  @Put('{id}')
  @Consumes("multipart/form-data")
  @SuccessResponseTags(StatusCodes.OK, "Updated")
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
  ): Promise<SuccessResponse<{}>> {
    const dataToUpdate: any = {
      name, description, mrp, sellingPrice, unit, category, quantity, productType, brand, sku, isActive, isFeatured
    };

    if (productDetails) {
      try {
        dataToUpdate.productDetails = JSON.parse(productDetails);
      } catch (e) {
        throwBadRequest('Invalid productDetails JSON');
      }
    }

    const cleanedData = cleanObject(dataToUpdate);

    const product = await productService.update(id, cleanedData, images);
    return this.sendSuccess(product, 'Product updated successfully.');
  }


  @Get('/')
  public async getAllProducts(
    @Queries() filter: ProductFilterQueryParams
  ): Promise<SuccessResponse<PaginatedResponse<IProduct>>> {
    const paginatedResult = await productService.getAll(filter);
    return this.sendPaginated(paginatedResult, 'Products fetched successfully.');
  }

  /**
   * Get a single product by its ID.
   */
  @Get('{id}')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async getProductById(@Path() id: string): Promise<SuccessResponse<IProduct>> {
    const product = await productService.getOne(id);
    return this.sendSuccess(product, 'Product fetched successfully.');
  }

  /**
   * Get a single product by its Slug.
   */
  @Get('slug/{slug}')
  public async getProductBySlug(@Path() slug: string): Promise<SuccessResponse<IProduct | null>> {
    const product = await productService.getProductBySlug(slug, false); // false = don't enforce public/active check for admin
    return this.sendSuccess(product, 'Product fetched successfully.');
  }

  /**
   * Delete a product by its ID.
   */
  @Delete('{id}')
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async deleteProduct(@Path() id: string): Promise<SuccessResponse<null>> {
    await productService.delete(id);
    return this.sendResponse('Product deleted successfully.');
  }
}