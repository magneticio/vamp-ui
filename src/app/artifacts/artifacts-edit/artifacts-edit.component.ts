import { Component } from '@angular/core';
import { NgForm } from '@angular/common';
import { OnActivate , Router , ROUTER_DIRECTIVES , RouteSegment } from '@angular/router';
import { Observable } from 'rxjs/Observable'

import { ArtifactsService } from '../artifacts.service';
import { NotificationService } from '../../shared/notifications.service';

@Component({
  moduleId: module.id,
  selector: 'app-artifacts-edit',
  templateUrl: 'artifacts-edit.component.html',
  styleUrls: ['artifacts-edit.component.css'],
  providers: [ ],
  directives: [ ROUTER_DIRECTIVES ],
})
export class ArtifactsEditComponent implements OnActivate {

  isNewArtifact = false;
  resource;
  selectedName;
  selectedResource;

  content   = '';
  submitted = false;

  constructor(
    // private _api : ApiService,
    private _artifacts : ArtifactsService,
    private _notifier : NotificationService,
    private _router : Router
  ) {
    console.log( this );
    // this.selectedResource = this._routeParams.get('resource') || 'deployments';
    // this.resource = this[ this.selectedResource ];
  }

  onSubmit() {
    if ( this.content ) {
      this.submitted = true;

      if ( ! this.resource ) {
        this._artifacts[ this.selectedResource ].add( this.content , { headers : { 'Accept' : 'application/x-yaml' } } )
          // .first()
          .subscribe(
            res => {
              this._notifier.addNotification( {
                message: `Succesfully added new ${ this.selectedResource.slice( 0 , -1 ) } "${ res.name }"`,
                type: 'success'
              } );
              this._router.navigate(['/' , this.selectedResource]);
            },
            err => {
              this._notifier.addNotification( {
                message: `Failed to add new ${ this.selectedResource.slice( 0 , -1 ) } because: "${ err }"`,
                type: 'error'
              } );
            }
          );
      } else {
        this._artifacts[ this.selectedResource ].update( this.resource , this.content , { headers : { 'Accept' : 'application/x-yaml' } } )
          // .first()
          .subscribe(
            res => {
              this._notifier.addNotification( {
                message: `Succesfully updated ${ this.selectedResource.slice( 0 , -1 ) } "${ res.name }"`,
                type: 'success'
              } );
              this._router.navigate(['/', this.selectedResource , encodeURIComponent( res.name ) ]);
            },
            err => {
              this._notifier.addNotification( {
                message: `Failed to update ${ this.selectedResource.slice( 0 , -1 ) } because: "${ err }"`,
                type: 'error'
              } );
            }
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
      this.isNewArtifact = true;
      this.selectedName = 'new ' + this.selectedResource.slice( 0 , -1 );
    }
  }

  _onError( error ) {
    let message = error;

    console.log( message );

    return Observable.throw( message );
  }

}
