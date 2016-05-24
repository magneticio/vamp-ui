import { Component } from '@angular/core';
import { NgForm } from '@angular/common';
import { OnActivate , Router , ROUTER_DIRECTIVES , RouteSegment } from '@angular/router';
import { Observable } from 'rxjs/Observable'

import { ArtifactsService } from '../artifacts.service';
// import { ApiService } from '../../shared/api.service';

@Component({
  moduleId: module.id,
  selector: 'app-artifacts-edit',
  templateUrl: 'artifacts-edit.component.html',
  styleUrls: ['artifacts-edit.component.css'],
  providers: [ ],
  directives: [ ROUTER_DIRECTIVES ],
})
export class ArtifactsEditComponent implements OnActivate {

  resource;
  selectedName;
  selectedResource;

  content   = '';
  submitted = false;

  constructor(
    // private _api : ApiService,
    private _artifacts : ArtifactsService,
    private _router : Router
  ) {
    console.log( this );
    // this.selectedResource = this._routeParams.get('resource') || 'deployments';
    // this.resource = this[ this.selectedResource ];
  }

  // create( editorInstance ) {
  //   if ( editorInstance.modified ) {
  //     editorInstance.save();
  //
  //     this._artifacts[ this.selectedResource ]
  //       .add( editorInstance.content , { headers: {'Accept' : 'application/x-yaml'} } );
  //   }
  //
  //   this._router.navigate(['../ArtifactsList' , { resource : this.selectedResource }]);
  // }



  onSubmit() {
    if ( this.content ) {
      this.submitted = true;

      if ( ! this.resource ) {
        this._artifacts[ this.selectedResource ].add( this.content , { headers : { 'Accept' : 'application/x-yaml' } } )
          // .first()
          .subscribe(
            res => { console.log( 'Success with' , res ) },
            err => { console.log( 'Failed with' , err ) }
          );
      } else {
        this._artifacts[ this.selectedResource ].update( this.resource , this.content , { headers : { 'Accept' : 'application/x-yaml' } } )
          // .first()
          .subscribe(
            res => { console.log( 'Success with' , res ) },
            err => { console.log( 'Failed with' , err ) }
          );
      }
    }
  }

  routerOnActivate( current: RouteSegment ) {
    this.selectedResource = current.getParam( 'resource' );
    this.selectedName     = decodeURIComponent( current.getParam( 'name' ) );

    if ( this.selectedName && this.selectedName != 'undefined' ) {
      this._artifacts[ this.selectedResource ].get( this.selectedName )
        .subscribe(
          res => this.resource = res,
          err => { console.error( 'GET Failed with' , err ) }
        );

      this._artifacts[ this.selectedResource ].get( this.selectedName , { headers : { 'Accept' : 'application/x-yaml' } } )
        .subscribe(
          res => this.content = res,
          err => { console.error( 'GET Failed with' , err ) }
        );
    } else {
      this.selectedName = 'new ' + this.selectedResource.slice( 0 , -1 );
    }
  }

  _onError( error ) {
    let message = error;

    console.log( message );

    return Observable.throw( message );
  }

}
