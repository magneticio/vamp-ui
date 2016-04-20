import {Component, Inject, ViewChild} from 'angular2/core';
import { RouteParams , ROUTER_DIRECTIVES } from 'angular2/router';

import { ArtifactsStore } from '../../services/store/artifacts';
import { Editor } from '../editor/editor';

@Component({
  directives  : [ ROUTER_DIRECTIVES , Editor ],
  providers   : [ ArtifactsStore ],
  selector    : 'artifacts-list',
  templateUrl : 'app/components/artifacts/_partials/list.html',
})

export class ArtifactsList {
  @ViewChild( Editor ) editorRef;

  private _artifacts;

  resource;
  editedResource = { name: null , original: null , modified: null };
  selectedResource;

  constructor(
    @Inject( ArtifactsStore ) ArtifactsStore,
    @Inject( RouteParams ) RouteParams
  ) {
    console.log( this , ArtifactsStore );
    this._artifacts = ArtifactsStore;

    this.selectedResource = RouteParams.get('resource') || 'deployments';
    this.resource = ArtifactsStore[ this.selectedResource ];
    // Reload resources when switching artifacts.
    this.resource.load();
  }

  edit( item ) {
    this.resource._api.get( this.selectedResource , item.name , { headers: {'Accept' : 'application/x-yaml'} } )
      .subscribe( res => this.editedResource = { name: item.name , original: res , modified: null } );
  }

  updateEditedResource( yaml ) {
    if ( this.editedResource.original != yaml ) {
      this.editedResource.modified = yaml;
    } else {
      this.editedResource.modified = null;
    }
  }

  save( item , yaml ) {

    if ( yaml ) {
      this.editedResource.original = yaml;

      this._artifacts[ this.selectedResource ]
        .update( item , yaml , { headers: {'Accept' : 'application/x-yaml'} } );
    }

  }

}
