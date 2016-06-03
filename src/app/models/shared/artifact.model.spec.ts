import {
  beforeEachProviders,
  it,
  describe,
  expect,
  inject
} from '@angular/core/testing';
import { ArtifactModel } from './artifact.model';

describe('Artifact Service', () => {
  beforeEachProviders(() => [ArtifactModel]);

  it('should ...',
      inject([ArtifactModel], (service: ArtifactModel) => {
    expect(service).toBeTruthy();
  }));
});
