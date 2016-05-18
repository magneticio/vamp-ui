import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { ArtifactsService } from './artifacts.service';

describe('Artifacts Service', () => {
  beforeEachProviders(() => [ArtifactsService]);

  it('should ...',
      inject([ArtifactsService], (service: ArtifactsService) => {
    expect(service).toBeTruthy();
  }));
});
