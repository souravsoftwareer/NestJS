import { Module,Global } from '@nestjs/common';
import { ParameterStoreService } from './parameter-store/parameter-store.service';

@Global()
@Module({
  providers: [ParameterStoreService],
  exports:[ParameterStoreService]
})
export class ConfigurationModule {}
