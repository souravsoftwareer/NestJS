import { Module } from '@nestjs/common';
import { ParameterStoreService } from './parameter-store/parameter-store.service';

@Module({
  providers: [ParameterStoreService],
  exports:[ParameterStoreService]
})
export class ConfigurationModule {}
