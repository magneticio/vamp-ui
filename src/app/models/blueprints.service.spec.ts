import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { Blueprints } from './blueprints.service';

describe('Blueprints Service', () => {
  beforeEachProviders(() => [Blueprints]);

  it('should ...',
      inject([Blueprints], (service: Blueprints) => {
    expect(service).toBeTruthy();
  }));
});
