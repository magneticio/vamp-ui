import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { Slas } from './slas.service';

describe('Slas Service', () => {
  beforeEachProviders(() => [Slas]);

  it('should ...',
      inject([Slas], (service: Slas) => {
    expect(service).toBeTruthy();
  }));
});
