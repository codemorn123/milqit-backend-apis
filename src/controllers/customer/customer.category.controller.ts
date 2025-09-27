import { ClientErrorInterface } from "./../../error/clientErrorHelper";
import { Controller, Get, Middlewares, NoSecurity, Path, Queries, Response, Route, Tags } from "tsoa";
import { StatusCodes } from 'http-status-codes';
import { SERVER_ERROR_EXAMPLE, VALIDATION_ERROR_EXAMPLE } from "./../../error/exampleErrors";
import { ICategory } from "./../../models/category.model";
import { success, SuccessResponse } from "./../../utils/SuccessResponse";
import { categoryService } from "./../../services/category.service";
import { IFilter, PaginatedResponse } from "./../../types/common.types";
import { validateSchemaMiddleware }  from "./../../middleware/common-validate";
import { idParamSchema } from "./../../constants/common.validator";


@Route("customer/categories")
@Tags("Customer - Categories")
// @Security("jwt", ["admin"])
@Response<ClientErrorInterface>(StatusCodes.UNAUTHORIZED, 'Unauthorized')
@Response<ClientErrorInterface>(StatusCodes.FORBIDDEN, 'Forbidden')
@Response<ClientErrorInterface>(StatusCodes.NOT_FOUND, 'Not Found')
@Response<ClientErrorInterface>(StatusCodes.CONFLICT, 'Conflict')
@Response<ClientErrorInterface>(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation Error', VALIDATION_ERROR_EXAMPLE)
@Response<ClientErrorInterface>(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', SERVER_ERROR_EXAMPLE)
export class CustomerCategoryController  extends Controller {


    @Get("/")
    @NoSecurity()
    public async getCategories(@Queries() fillter: IFilter): Promise<SuccessResponse<PaginatedResponse<ICategory>>> {
        const result = await categoryService.listCategories(fillter);
        return success(result, "Categories fetched successfully");
      }



      @Get("{id}")
      @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
      public async getCategoryById(@Path() id: string): Promise<SuccessResponse<ICategory>> {
        const category = await categoryService.getCategoryById(id);
        return success(category);
      }
    
 

}