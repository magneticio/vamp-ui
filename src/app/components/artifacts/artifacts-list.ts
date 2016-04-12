import {Component, Inject} from 'angular2/core';
import { RouteConfig , RouteParams , ROUTER_DIRECTIVES } from 'angular2/router';

import { ArtifactsStore } from '../../services/store/artifacts';
import { Editor } from '../editor/editor';

@Component({
  directives  : [ ROUTER_DIRECTIVES , Editor ],
  providers   : [ ArtifactsStore ],
  selector    : 'artifacts-list',
  templateUrl : 'app/components/artifacts/_partials/list.html',
})

export class ArtifactsList {

  resource;
  editedResource = { name: null , yaml: null };
  selectedResource;

  constructor(
    @Inject( ArtifactsStore ) ArtifactsStore,
    @Inject( RouteParams ) RouteParams
  ) {
    console.log( this , ArtifactsStore );
    this.selectedResource = RouteParams.get('resource') || 'deployments';
    this.resource = ArtifactsStore[ this.selectedResource ];
    // Reload resources when switching artifacts.
    this.resource.load();
  }

  edit( item ) {
    this.resource._api.get( this.selectedResource , item.name , { headers: {'Accept' : 'application/x-yaml'} } )
      .subscribe( res => this.editedResource = { name: item.name , yaml: res } );
  }

}
