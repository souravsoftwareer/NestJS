import { Injectable, Logger } from '@nestjs/common';
import * as AWSParamStore from 'aws-param-store';
import * as dotenv from 'dotenv';

@Injectable()
export class ParameterStoreService {
  private readonly logger = new Logger(ParameterStoreService.name);
  private environment: string;

  constructor() {
    this.environment = process.env.NODE_ENV || 'dev'; // Default to 'dev' if NODE_ENV is not set

  }

  async getParameter(path: string): Promise<string | undefined> {
    try {
      const parameters = await AWSParamStore.getParameterSync(path, {
        region: process.env.AWS_REGION
      });
      let value = parameters?.Value??"" 
      console.log("path ",path," value ",value)
      return value
     
    } catch (error) {
      console.error('Error loading parameters from AWS Parameter Store', error);
      return undefined;
    }
  }

  
}

