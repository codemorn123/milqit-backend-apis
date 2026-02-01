import kisanCommunityUpload from './../../../utils/kisan-community-upload';
import { handleValidationError } from './../../../utils/error-helpers';
import { cleanObject } from './../../../utils/object.utils';
import { validateSchemaMiddleware } from './../../../middleware/common-validate';
import kisanCommunityService from './../../../services/admin/cms/kisan-community.service';
import { IFilter, PaginatedResponse } from '../../../types/common.types';
import { IKisanCommunity } from './../../../types/kisan-community.types';
import { createKisanCommunitySchema, filterQuerySchema, idParamSchema, updateKisanCommunitySchema } from './../../../validations/kisan-community.validator';
import {
  Route,
  Tags,
  Controller,
  Post,
  Middlewares,
  Get,
  Queries,
  SuccessResponse,
  Path,
  Delete,
  Put,
  Consumes,
  UploadedFile,
  FormField,
  Response,
  Example,
} from 'tsoa';
import { errorSuccess, success, SuccessResponse as SuccessDataResponse } from './../../../utils/SuccessResponse';



import { BaseController } from '../../base.controller';

@Route("admin/cms/kisan-community")
@Tags("Kisan Community")
export class KisanCommunityController extends BaseController {

  //   @Middlewares(kisanCommunityUpload.single("profileImage"))
  @Post("/")
  @Consumes("multipart/form-data")
  @SuccessResponse(201, "Created")
  @Response(400, "Validation Failed")
  public async create(
    @FormField() farmerName: string, @FormField() farmName: string, @FormField() farmLocation: string,
    @FormField() mobile: string, @FormField() products: string, @FormField() description: string,
    @FormField() email?: string, @UploadedFile("profileImage") profileImage?: Express.Multer.File
  ): Promise<SuccessDataResponse<IKisanCommunity>> {
    const cleanedData = cleanObject({ farmerName, farmName, farmLocation, mobile, products, description, email });
    const { error, value } = createKisanCommunitySchema.validate(cleanedData);
    if (error) handleValidationError(error);
    const result = await kisanCommunityService.create(value, profileImage);
    return success(result, 'Kisan Community created successfully');
  }

  @Get("/")
  @SuccessResponse(200, "Success")
  @Middlewares(validateSchemaMiddleware(filterQuerySchema, "query"))
  @Example({
    queryParams: {
      page: 1,
      limit: 10
    }
  })
  public async getAll(
    @Queries() queryParams: IFilter
  ): Promise<SuccessDataResponse<PaginatedResponse<IKisanCommunity>>> {
    const result = await kisanCommunityService.getAll(queryParams);
    return success(result, 'Kisan community members fetched successfully');
  }

  @Get("/{id}")
  @SuccessResponse(200, "Success")
  @Response(404, "Not Found")
  @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
  public async getById(@Path() id: string): Promise<IKisanCommunity> {
    return kisanCommunityService.getOne(id);
  }

  @Middlewares(kisanCommunityUpload.single("profileImage"))
  @Put("/{id}")
  @Consumes("multipart/form-data")
  @SuccessResponse(200, "Success")
  @Response(404, "Not Found")
  @Response(400, "Validation Failed")
  @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
  public async update(
    @Path() id: string, @FormField() farmerName?: string, @FormField() farmName?: string,
    @FormField() farmLocation?: string, @FormField() mobile?: string, @FormField() products?: string,
    @FormField() description?: string, @FormField() email?: string,
    @UploadedFile("profileImage") profileImage?: Express.Multer.File
  ): Promise<IKisanCommunity> {
    const cleanedData = cleanObject({ farmerName, farmName, farmLocation, mobile, products, description, email });
    const { error, value } = updateKisanCommunitySchema.validate(cleanedData);
    if (error) handleValidationError(error);
    return kisanCommunityService.update(id, value, profileImage);
  }

  @Delete("/{id}")
  @SuccessResponse(200, "Success")
  @Response(404, "Not Found")
  @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
  public async delete(@Path() id: string): Promise<{ message: string }> {
    return kisanCommunityService.delete(id);
  }
}