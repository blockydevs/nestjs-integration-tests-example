import { Module } from '@nestjs/common';
import { FakeApiStoreManagerAdapter } from './fake-api/fake-api-store-manager.adapter';
import { MockStoreManagerAdapter } from '../../test/store-manager/mock/mock-store-manager.adapter';
import { StoreManagerPort } from './store-manager.port';
import { HttpModule } from '@nestjs/axios';

const storeManagerProvider = {
  provide: StoreManagerPort,
  useClass:
    process.env.NODE_ENV === 'test'
      ? MockStoreManagerAdapter
      : FakeApiStoreManagerAdapter,
};

@Module({
  imports: [HttpModule],
  providers: [storeManagerProvider],
  exports: [storeManagerProvider],
})
export class StoreManagerModule {}
