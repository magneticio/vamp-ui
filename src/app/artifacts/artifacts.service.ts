import { Inject, Injectable } from '@angular/core';

import {Blueprints} from '../models/blueprints.service';
import {Breeds} from '../models/breeds.service';
import {Deployments} from '../models/deployments.service';
import {Escalations} from '../models/escalations.service';
import {Filters} from '../models/filters.service';
import {Gateways} from '../models/gateways.service';
import {Scales} from '../models/scales.service';
import {Slas} from '../models/slas.service';
import {Workflows} from '../models/workflows.service';

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
