import {Component, Inject} from 'angular2/core';
import {RouteParams, Router, RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';

import {Editor} from '../editor/editor';

import { Blueprints } from './blueprints/blueprints';
import { Breeds } from './breeds/breeds';
import { Deployments } from './deployments/deployments';
// import { Escalations } from './escalations/escalations';
// import { Filters } from './filters/filters';
import { Gateways } from './gateways/gateways';
// import { Scales } from './scales/scales';
// import { Slas } from './slas/slas';
// import { Workflows } from './workflows/workflows';

const VAMP_ARTIFACTS = [
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

@Component({
  selector: 'artifacts',
  templateUrl: 'app/components/artifacts/_partials/list.html',
  styleUrls: ['app/components/artifacts/artifacts.css'],
  providers: [ VAMP_ARTIFACTS ],
  directives: [ RouterOutlet, ROUTER_DIRECTIVES ],
  pipes: []
})
export class Artifacts {

  resource;
  selectedResource;

  constructor(
    @Inject( Blueprints ) private blueprints,
    @Inject( Breeds ) private breeds,
    @Inject( Deployments ) private deployments,
    @Inject( Gateways ) private gateways,
    @Inject( RouteParams ) private _routeParams
  ) {
    console.log( this );
    // this.selectedResource = this._routeParams.get('resource') || 'deployments';
    // this.resource = this[ this.selectedResource ];
  }

  ngOnInit() {
    this.selectedResource = this._routeParams.get('resource') || 'deployments';
    this.resource = this[ this.selectedResource ];
  }

}
