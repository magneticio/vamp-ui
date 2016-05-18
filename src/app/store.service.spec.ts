import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { StoreService } from './store.service';

describe('Store Service', () => {
  beforeEachProviders(() => [StoreService]);

  it('should ...',
      inject([StoreService], (service: StoreService) => {
    expect(service).toBeTruthy();
  }));
});
