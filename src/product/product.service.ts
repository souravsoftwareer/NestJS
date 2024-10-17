import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { CreateProductDTO } from "./dto/create-product.dto";
import { Repository,MongoRepository } from "typeorm";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: MongoRepository<Product>
  ) {}

  public async createProduct(createProductDto: CreateProductDTO): Promise<Product> {
    let product = this.productRepository.create(createProductDto)
    Logger.log("before save ",product)
    return await this.productRepository.save(product);
  }

  public async getProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  public async getProduct(productId: string): Promise<Product> {
    console.log('produc id',productId)
    return await this.productRepository.findOne({
      where: { _id: productId },
    });
  }

  public async editProduct(
    productId: number,
    createProductDto: CreateProductDTO
  ): Promise<Product> {
    const editedProduct = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!editedProduct) {
      throw new NotFoundException("Product not found");
    }
    await this.productRepository.update({ id: productId }, createProductDto);
    return editedProduct;
  }

  public async deleteProduct(productId: number): Promise<void> {
    await this.productRepository.delete(productId);
  }
}
