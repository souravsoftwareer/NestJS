import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class MediaService {
    private s3: S3;
    
    constructor() {
      this.s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      });
    }

    async uploadFile(file: Express.Multer.File): Promise<S3.ManagedUpload.SendData> {
        const uploadParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME, // Your S3 bucket name
          Key: `${Date.now()}-${file.originalname}`, // File name in S3
          Body: file.buffer, // File buffer (if you're using multer's memory storage)
          // ACL: 'public-read', // Set file to be publicly readable, you can remove this if you want restricted access
        };
        console.log('file data ',file)
        try {
          const result = await this.s3.upload(uploadParams).promise();
          return result; // Returns the upload result, including file URL
        } catch (error) {
          throw new Error(`Error uploading file: ${error.message}`);
        }
      }
}
