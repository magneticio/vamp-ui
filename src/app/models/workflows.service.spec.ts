import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { Workflows } from './workflows.service';

describe('Workflows Service', () => {
  beforeEachProviders(() => [Workflows]);

  it('should ...',
      inject([Workflows], (service: Workflows) => {
    expect(service).toBeTruthy();
  }));
});
