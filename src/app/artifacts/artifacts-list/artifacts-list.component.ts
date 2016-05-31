import { Component, Inject , OnInit } from '@angular/core';
import { OnActivate, ROUTER_DIRECTIVES , Router, RouteSegment , RouteTree } from '@angular/router';

import { ArtifactsService } from '../artifacts.service';

@Component({
  moduleId: module.id,
  selector: 'app-artifacts-list',
  templateUrl: 'artifacts-table.component.html',
  styleUrls: ['artifacts-list.component.css'],
  directives: [ ROUTER_DIRECTIVES ]
})
export class ArtifactsListComponent implements OnActivate {

  resource;
  editedResource = { name: null , original: null , modified: null };
  selectedResource;

  constructor(
    private _artifacts : ArtifactsService,
    private _router : Router
  ) {
  }

  // add() {
  //   console.log( `Adding ${this.selectedResource}` );
  //   this._router.navigate([ '/' , this.selectedResource , 'add' ]);
  // }

  delete( item ) {
    this._artifacts[ this.selectedResource ].delete( item )
      .first()
      .subscribe(
        res => console.log( res ),
        err => console.error( err )
      );
  }

  edit( item ) {
    this.resource._api.get( this.selectedResource , item.name , { headers: {'Accept' : 'application/x-yaml'} } )
      .subscribe( res => this.editedResource = { name: item.name , original: res , modified: null } );
  }

  encode( name ) {
    return encodeURIComponent( name );
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

  routerOnActivate( current: RouteSegment, previous? : RouteSegment , currTree? : RouteTree ): void {
    console.log( 'Routed to ' , current.getParam( 'resource' ) );

    this.selectedResource = current.getParam( 'resource' ) || 'deployments';
    this.resource = this._artifacts[ this.selectedResource ];

    this.resource.load();
  }

  // ngOnInit() {
  //   console.log( 'Init ' , this.selectedResource );
  //   // this.resource.load();
  // }

}
