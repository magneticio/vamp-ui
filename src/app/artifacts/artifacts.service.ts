import { Inject, Injectable } from '@angular/core';

import {Blueprints} from '../models/artifact-stores/blueprints.service';
import {Breeds} from '../models/artifact-stores/breeds.service';
import {Deployments} from '../models/artifact-stores/deployments.service';
import {Escalations} from '../models/artifact-stores/escalations.service';
import {Filters} from '../models/artifact-stores/filters.service';
import {Gateways} from '../models/artifact-stores/gateways.service';
import {Scales} from '../models/artifact-stores/scales.service';
import {Slas} from '../models/artifact-stores/slas.service';
import {Workflows} from '../models/artifact-stores/workflows.service';

export const VAMP_ARTIFACTS = [
  Blueprints,
  Breeds,
  Deployments,
  Escalations,
  Filters,
  Gateways,
  Scales,
  Slas,
  Workflows
]

@Injectable()
@Inject( VAMP_ARTIFACTS )
export class ArtifactsService {
  constructor(
    public blueprints : Blueprints,
    public breeds : Breeds,
    public deployments : Deployments,
    public gateways : Gateways
  ) {}
}
