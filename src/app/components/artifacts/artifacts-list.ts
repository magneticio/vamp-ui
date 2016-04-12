import {Component, Inject} from 'angular2/core';
import { RouteConfig , RouteParams , ROUTER_DIRECTIVES } from 'angular2/router';

import { ArtifactsStore } from '../../services/store/artifacts';

@Component({
  directives  : [ ROUTER_DIRECTIVES ],
  providers   : [ ArtifactsStore ],
  selector    : 'artifacts-list',
  templateUrl : 'app/components/artifacts/_partials/list.html',
})

export class ArtifactsList {

  resource;
  selectedResource;

  constructor(
    @Inject( ArtifactsStore ) ArtifactsStore,
    @Inject( RouteParams ) RouteParams
  ) {
    console.log( this , ArtifactsStore );
    this.selectedResource = RouteParams.get('resource') || 'deployments';
    this.resource = ArtifactsStore[ this.selectedResource ];
  }

  edit() {

  }

}
