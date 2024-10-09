import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { log } from 'console';

import * as dotenv from 'dotenv';
import * as multer from 'multer';

// Load the appropriate .env file based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'dev'; // Default to development
const envFilePath = nodeEnv === 'prod' ? '.env.prod' : '.env';
dotenv.config({ path: envFilePath });
const storage = multer.memoryStorage();


// import * as dotenv from 'dotenv'
// Multer configuration
// dotenv.config({})



// Multer upload options for disk storage
export const multerOptions = {
    // Enable file size limits
    limits: {
        fileSize: +process.env.MAX_FILE_SIZE,
    },
    // Check the mimetypes to allow for upload
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            // Allow storage of file
            cb(null, true);
        } else {
            // Reject file
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
    },
    // Storage properties
    storage: diskStorage({
        // Destination storage path details
        destination: (req: any, file: any, cb: any) => {
            console.log('upload path ',process.env.UPLOAD_LOCATION)
            const uploadPath = process.env.UPLOAD_LOCATION;
            // Create folder if doesn't exist
            log("uploadPath ",uploadPath)
            if(!uploadPath) {
                cb(new HttpException(`Upload location not found`, HttpStatus.BAD_REQUEST), false);
            }
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath);
            }
            cb(null, uploadPath);
        },
        // File modification details
        filename: (req: any, file: any, cb: any) => {
            // Calling the callback passing the random name generated with the original extension name
            cb(null, `${uuid()}${extname(file.originalname)}`);
        },
    }),
};

export const multerS3Options = {
  
    limits: {
      fileSize: 500 * 1024 * 1024, // 5 MB limit
    },
    storage: storage,
    fileFilter: (req, file, callback) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        callback(null, true);
      } else {
        callback(new Error('Unsupported file format'), false);
      }
    },
  
  };

