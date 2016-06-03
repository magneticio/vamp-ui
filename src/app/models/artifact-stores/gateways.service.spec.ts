import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { Gateways } from './gateways.service';

describe('Gateways Service', () => {
  beforeEachProviders(() => [Gateways]);

  it('should ...',
      inject([Gateways], (service: Gateways) => {
    expect(service).toBeTruthy();
  }));
});
