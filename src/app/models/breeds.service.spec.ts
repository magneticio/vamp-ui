import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { Breeds } from './breeds.service';

describe('Breeds Service', () => {
  beforeEachProviders(() => [Breeds]);

  it('should ...',
      inject([Breeds], (service: Breeds) => {
    expect(service).toBeTruthy();
  }));
});
