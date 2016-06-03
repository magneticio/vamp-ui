import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { Escalations } from './escalations.service';

describe('Escalations Service', () => {
  beforeEachProviders(() => [Escalations]);

  it('should ...',
      inject([Escalations], (service: Escalations) => {
    expect(service).toBeTruthy();
  }));
});
