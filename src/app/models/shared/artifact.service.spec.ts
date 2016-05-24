import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { ArtifactService } from './artifact.service';

describe('Artifact Service', () => {
  beforeEachProviders(() => [ArtifactService]);

  it('should ...',
      inject([ArtifactService], (service: ArtifactService) => {
    expect(service).toBeTruthy();
  }));
});
