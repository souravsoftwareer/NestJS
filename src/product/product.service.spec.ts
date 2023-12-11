import { Test, TestingModule } from "@nestjs/testing";
import { ProductService } from "./product.service";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  save: jest.fn((entity) => entity),
  find: jest.fn((entity) => entity),
  findOne: jest.fn((entity) => entity),
  delete: jest.fn((entity) => entity),
  // ...
}));

const mockProduct = {
  id: 1,
  name: "Test name",
  description: "Test description",
  price: "20",
};

describe("ProductService", () => {
  let service: ProductService;
  let repositoryMock: MockType<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    service = await module.get<ProductService>(ProductService);
    repositoryMock = await module.get(getRepositoryToken(Product));
  });

  describe("createProduct", () => {
    it("should save a product in the database", async () => {
      repositoryMock.save.mockReturnValue("someProduct");
      expect(repositoryMock.save).not.toHaveBeenCalled();
      const createProductDto = {
        name: "sample name",
        description: "sample description",
        price: "10",
      };
      const result = await service.createProduct(createProductDto);
      expect(result).toEqual("someProduct");
    });
  });

  describe("getProducts", () => {
    it("should get all products", async () => {
      repositoryMock.find.mockReturnValue(mockProduct);
      expect(repositoryMock.find).not.toHaveBeenCalled();
      const result = await service.getProducts();
      expect(repositoryMock.find).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });
  });
});