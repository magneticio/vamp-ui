import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { Filters } from './filters.service';

describe('Filters Service', () => {
  beforeEachProviders(() => [Filters]);

  it('should ...',
      inject([Filters], (service: Filters) => {
    expect(service).toBeTruthy();
  }));
});
