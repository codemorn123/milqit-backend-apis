
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
  Consumes,
  UploadedFile,
  UploadedFiles,
  FormField,
} from "tsoa";


import { IImage } from "./../../types/image.type";
import { IFilter, IPaginated } from "./../../types/common.types";
import imageService from "./../../services/image.service";
import { validateSchemaMiddleware } from "./../../middleware/common-validate";
import { idParamSchema } from "./../../constants/common.validator";
import upload from "./../../utils/upload";
import express from 'express';
import { uuidv4 } from "zod";


interface MulterRequest extends express.Request {
  file?: Express.Multer.File;
}





@Route("images")
@Tags("Image")
export class ImagesController extends Controller {

  @Post("/")
  @Consumes("multipart/form-data")
  @SuccessResponse(201, "Image uploaded successfully")
  public async uploadImage(
    @Request() request: MulterRequest
  ): Promise<{
    success: boolean;
    message: string;
    data: IImage;
  }> {
    try {
      console.log("🚀 Starting image upload...");
      
      // Debug: Log all request properties
      console.log("🔍 Request debug info:");
      console.log("- Content-Type:", request.get('Content-Type'));
      console.log("- Body:", request.body);
      console.log("- File:", request.file);
      console.log("- Files:", request.files);
      console.log("- Headers:", request.headers);

      // Check if file exists in different possible locations
      let file: Express.Multer.File | undefined;

      if (request.file) {
        file = request.file;
        console.log("✅ Found file in request.file");
      } else if (request.files) {
        if (Array.isArray(request.files)) {
          file = request.files[0];
          console.log("✅ Found file in request.files array");
        } else if (typeof request.files === 'object') {
          // Check common field names
          const possibleFields = ['file', 'image', 'upload'];
          for (const fieldName of possibleFields) {
            if (request.files[fieldName]) {
              file = Array.isArray(request.files[fieldName]) 
                ? request.files[fieldName][0] 
                : request.files[fieldName];
              console.log(`✅ Found file in request.files.${fieldName}`);
              break;
            }
          }
        }
      }

      if (!file) {
        console.error("❌ No file found in request");
        console.error("Available request properties:", Object.keys(request));
        this.setStatus(400);
        throw new Error("No file uploaded");
      }

      console.log("📁 File details:", {
        originalname: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: file.path
      });

      // Validate file properties
      if (!file.filename || !file.originalname) {
        this.setStatus(500);
        throw new Error("Invalid file properties");
      }

      // Generate unique key
      const uniqueKey = `${file.filename}`;

      const data = {
        title: request.body.title || file.originalname,
        filename: file.filename,
        originalname: file.originalname,
        url: `/uploads/images/${file.filename}`,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        key: uniqueKey,
        description: request.body.description || '',
        category: request.body.category || 'general'
      };

      console.log("💾 Creating image with data:", {
        title: data.title,
        filename: data.filename,
        key: data.key
      });

      const result = await imageService.create(data);
      
      this.setStatus(201);
      console.log("✅ Image uploaded successfully:", result.url);

      return {
        success: true,
        message: "Image uploaded successfully",
        data: result
      };

    } catch (error) {
      console.error("❌ Upload error:", error);
      this.setStatus(500);
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