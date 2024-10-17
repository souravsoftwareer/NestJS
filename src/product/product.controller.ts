import { Controller, Post, Body, Get, Patch, Param, Delete, UseGuards, UseInterceptors, Request } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDTO } from "./dto/create-product.dto";
import { Product } from "./product.entity";
import { AuthGuard } from "../auth/guards/auth.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { LoggingInterceptor } from "src/interceptors/LoggingInterceptor";

@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseInterceptors(LoggingInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post("create")
  public async createProduct(@Body() createProductDto: CreateProductDTO): Promise<Product> {
    const product = await this.productService.createProduct(createProductDto);
    return product;
  }
  @UseInterceptors(LoggingInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get("all")
  public async getProducts(@Request() req): Promise<Product[]> {
    const user = req.user; // This is the user data attached by JwtStrategy
    console.log('Decoded JWT data:', user); // Debug log
    const products = await this.productService.getProducts();
    return products;
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:productId")
  public async getProduct(@Param("productId") productId: string) {
    const product = await this.productService.getProduct(productId);
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/edit/:productId")
  public async editProduct(
    @Body() createProductDto: CreateProductDTO,
    @Param("productId") productId: number
  ): Promise<Product> {
    const product = await this.productService.editProduct(productId, createProductDto);
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/delete/:productId")
  public async deleteProduct(@Param("productId") productId: number) {
    const deletedProduct = await this.productService.deleteProduct(productId);
    return deletedProduct;
  }
}