import { Test, TestingModule } from '@nestjs/testing';
import { ParameterStoreService } from './parameter-store.service';

describe('ParameterStoreService', () => {
  let service: ParameterStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParameterStoreService],
    }).compile();

    service = module.get<ParameterStoreService>(ParameterStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
