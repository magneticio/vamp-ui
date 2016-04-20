import { Component , Inject } from 'angular2/core';
import { Router , RouteParams , ROUTER_DIRECTIVES } from 'angular2/router';

import { ArtifactsStore } from '../../services/store/artifacts';
import {Editor} from '../editor/editor';

@Component({
  selector: 'artifacts-creator',
  templateUrl: 'app/components/artifacts/_partials/edit.html',
  providers: [ ArtifactsStore ],
  directives: [ Editor , ROUTER_DIRECTIVES ],
  pipes: []
})
export class ArtifactsCreator {

  _artifacts;
  _router;

  resource;
  selectedResource;

  constructor(
    @Inject( ArtifactsStore ) ArtifactsStore,
    @Inject( Router ) Router,
    @Inject( RouteParams ) RouteParams
  ) {
    this._artifacts = ArtifactsStore;
    this._router    = Router;

    this.selectedResource = RouteParams.get('resource');

    console.log( this );
    // this.selectedResource = this._routeParams.get('resource') || 'deployments';
    // this.resource = this[ this.selectedResource ];
  }

  create( editorInstance ) {

    if ( editorInstance.modified ) {
      editorInstance.save();

      this._artifacts[ this.selectedResource ]
        .add( editorInstance.content , { headers: {'Accept' : 'application/x-yaml'} } );
    }

    this._router.navigate(['../ArtifactsList' , { resource : this.selectedResource }]);

  }

}
