import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';

@Module({
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product])], // add this

  controllers: [ProductController]
})
export class ProductModule {}
