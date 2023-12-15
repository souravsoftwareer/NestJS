import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './../config/multer.config';

@Controller('media')
export class MediaController {
    
    @Post('upload')
    @UseInterceptors(FileInterceptor('file',multerOptions))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
    }
}
