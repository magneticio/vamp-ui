import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { Scales } from './scales.service';

describe('Scales Service', () => {
  beforeEachProviders(() => [Scales]);

  it('should ...',
      inject([Scales], (service: Scales) => {
    expect(service).toBeTruthy();
  }));
});
