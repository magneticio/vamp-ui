import { Component , Inject , Injectable } from 'angular2/core'
import { RouteConfig , RouterOutlet } from 'angular2/router'

import { Blueprints } from './blueprints/blueprints';
import { Breeds } from './breeds/breeds';
import { Deployments } from './deployments/deployments';
// import { Escalations } from './escalations/escalations';
// import { Filters } from './filters/filters';
import { Gateways } from './gateways/gateways';
// import { Scales } from './scales/scales';
// import { Slas } from './slas/slas';
// import { Workflows } from './workflows/workflows';

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

import { ArtifactsDetail } from './artifacts-detail'
import { ArtifactsList } from './artifacts-list'

@Component({
  directives: [ RouterOutlet ],
  providers : [ VAMP_ARTIFACTS ],
  selector  : 'vamp-artifacts',
  // templateUrl : './app/components/artifacts/artifacts.html'
  template  : '<router-outlet></router-outlet>'
})

@RouteConfig([
  { path: '/...' , redirectTo: ['ArtifactsList' , { resource: 'deployments' }] , useAsDefault: true },
  { path: '/:resource'             , name: 'ArtifactsList'         , component: ArtifactsList   },
  { path: '/:resource/:id'         , name: 'ArtifactsDetail'       , component: ArtifactsDetail },
  { path: '/:resource/:id/:action' , name: 'ArtifactsDetailAction' , component: ArtifactsDetail },
])

export class Artifacts {
  constructor() {}
}

@Injectable()
export class ArtifactsStore {
  constructor(
    @Inject( Blueprints ) private blueprints,
    @Inject( Breeds ) private breeds,
    @Inject( Deployments ) private deployments,
    @Inject( Gateways ) private gateways
  ) {
    console.log( this );
  }
}
