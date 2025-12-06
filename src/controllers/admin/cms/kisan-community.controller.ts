import kisanCommunityUpload from './../../../utils/kisan-community-upload';
import APIError from './../../../error/api-error';
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



@Route("dashbord/cms/kisan-community")
@Tags("Kisan Community")
export class KisanCommunityController extends Controller {

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
    const dataToValidate = { farmerName, farmName, farmLocation, mobile, products, description, email };
    const { error, value } = createKisanCommunitySchema.validate(dataToValidate);
    if (error) {
      errorSuccess(error);
      throw new APIError(error.details[0].message, 400);
    }
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
    const dataToValidate = { farmerName, farmName, farmLocation, mobile, products, description, email };
    Object.keys(dataToValidate).forEach(key => dataToValidate[key] === undefined && delete dataToValidate[key]);

    const { error, value } = updateKisanCommunitySchema.validate(dataToValidate);
    if (error) {
      this.setStatus(400);
      throw new APIError(error.details[0].message, 400);
    }
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