import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { Deployments } from './deployments.service';

describe('Deployments Service', () => {
  beforeEachProviders(() => [Deployments]);

  it('should ...',
      inject([Deployments], (service: Deployments) => {
    expect(service).toBeTruthy();
  }));
});
