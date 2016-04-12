import { Inject , Injectable } from 'angular2/core';

import { Blueprints } from '../artifacts/blueprints/blueprints';
import { Breeds } from '../artifacts/breeds/breeds';
import { Deployments } from '../artifacts/deployments/deployments';
// import { Escalations } from '../artifacts/escalations/escalations';
// import { Filters } from '../artifacts/filters/filters';
import { Gateways } from '../artifacts/gateways/gateways';
// import { Scales } from '../artifacts/scales/scales';
// import { Slas } from '../artifacts/slas/slas';
// import { Workflows } from '../artifacts/workflows/workflows';

export const VAMP_ARTIFACTS = [
  Blueprints,
  Breeds,
  Deployments,
  // Escalations,
  // Filters,
  Gateways,
  // Scales,
  // Slas,
  // Workflows
];


@Injectable()
@Inject( VAMP_ARTIFACTS )
export class ArtifactsStore {
  constructor(
    public blueprints : Blueprints,
    public breeds : Breeds,
    public deployments : Deployments,
    public gateways : Gateways
  ) {}
}
