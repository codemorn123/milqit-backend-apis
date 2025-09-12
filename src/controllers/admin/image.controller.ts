// import imageService from "../service/image.service";
// import upload from "../util/upload";
import {
  Route,
  Tags,
  Controller,
  Request,
  Post,
  Middlewares,
  Get,
  Queries,
  SuccessResponse,
  Path,
  Delete,
  Put,
  UploadedFile,
} from "tsoa";
// import { IImage } from "../model/types/image.type";
// import { IFilter, IPaginated } from "../model/types/common.type";

// import upload from "./../../utils/upload";
import { IImage } from "./../../types/image.type";
import { IFilter, IPaginated } from "./../../types/common.types";
import imageService from "./../../services/image.service";
import { validateSchemaMiddleware } from "./../../middleware/common-validate";
import { idParamSchema } from "./../../constants/common.validator";

// import upload from "./../../utils/upload";
import fs from "fs";
import  upload  from "./../../utils/upload";
import { getImageUrl } from "./../../utils/imageManager";

@Route("images")
@Tags("Image")
export class ImagesController extends Controller {
  @Post("/")
//   @Middlewares([upload.single("file")])
  @Middlewares([upload.single("file")])
//   @UploadedFile("file")
  public async getImages(@Request() request: any): Promise<IImage | undefined> {
     try {
    // Multer local disk storage provides filename and path
    const file = request.file;
    if (!file) throw new Error("No file uploaded");

    // Assuming 'uploads' is served statically as '/uploads/filename'
   const data = {
  title: file.originalname,
  url: `/uploads/images/${file.filename}`,
  key: file.filename,
};

    return await imageService.create(data);
  } catch (error) {
    console.log("errorerrorerror",error);
    throw error;
  }
  }

  
//   @Post("/")
//   @Middlewares([upload.single("file")])
//   @SuccessResponse("201", "Image uploaded successfully")
//   public async uploadImage(@Request() request: any): Promise<IImage> {
//     try {
//       console.log("🚀 Starting image upload...");
      
//       const file = request.file;
//       if (!file) {
//         this.setStatus(400);
//         throw new Error("No file uploaded");
//       }

//       // Verify file exists on disk
//       if (!fs.existsSync(file.path)) {
//         console.error(`❌ File not saved to disk: ${file.path}`);
//         this.setStatus(500);
//         throw new Error("File upload failed - file not saved");
//       }

//       // Create image record
//       const imageData = {
//         title: file.originalname,
//         filename: file.filename,
//         originalname: file.originalname,
//         url: getImageUrl(file.filename),
//         path: file.path,
//         size: file.size,
//         mimetype: file.mimetype,
//       };
      
//       const result = await imageService.create(imageData);
//       this.setStatus(201);
//       return result;
      
//     } catch (error) {
//       console.error("❌ Upload error:", error);
      
//       // Clean up failed upload
//       if (request.file?.path && fs.existsSync(request.file.path)) {
//         try {
//           fs.unlinkSync(request.file.path);
//           console.log("🧹 Cleaned up failed upload");
//         } catch (cleanupError) {
//           console.error("❌ Cleanup error:", cleanupError);
//         }
//       }
      
//       this.setStatus(500);
//       throw error;
//     }
//   }


  @Get("/")
  @SuccessResponse("200", "Successfully fetched all address")
  public async getAll(@Queries() queryParams: IFilter): Promise<{
    data: IImage[];
    pagination: IPaginated;
  }> {
    try {
      const response = await imageService.getAll(queryParams);
      return {
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get("/{id}")
  @SuccessResponse("200", "Successfully fetched address by ID")
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async getById(@Path() id: string): Promise<IImage | null> {
    try {
      return await imageService.getOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Put("/{id}")
  @SuccessResponse("200", "Successfully updated address by ID")
  @Middlewares([upload.single("file")])
  @Middlewares([validateSchemaMiddleware(idParamSchema, "params")])
  public async update(
    @Path() id: string,
    @Request() request: any
  ): Promise<IImage | null> {
    try {
      const data = {
        title: request.file.originalname,
        url: request.file.location,
        key: request.file.key,
      };
      return await imageService.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  @Delete("/{id}")
  @SuccessResponse("200", "Successfully deleted address by ID")
  @Middlewares(validateSchemaMiddleware(idParamSchema, "params"))
  public async delete(@Path() id: string): Promise<{
    message: string;
    status: number;
  }> {
    try {
      return await imageService.delete(id);
    } catch (error) {
      throw error;
    }
  }
}