import { Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, multerS3Options } from './../config/multer.config';
import { Response } from 'express';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file',multerOptions))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
      console.log(file);
  }
  @Post('upload/s3')
  @UseInterceptors(FileInterceptor('file',multerS3Options)) // Ensure Multer is set up correctly
  async uploadFileToS3(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    if (!file) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'No file uploaded',
      });
    }
    // console.log('file ',file)
    try {
      const uploadResult = await this.mediaService.uploadFile(file);
      return res.status(HttpStatus.OK).json({
        message: 'File uploaded successfully!',
        fileUrl: uploadResult.Location, // S3 file URL
      });
    } catch (error) {
      console.log("error ", error)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error uploading file',
        error: error.message,
      });
    }
  }
}
