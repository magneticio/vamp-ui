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

  protected _interval;
  protected _intervalTime = 10000;

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

      // If no resource is specified we're going to add a new artifact to VAMP
      if ( ! this.resource ) {
        this.save();
      }
      // Else we know the selected artifact is to be updated.
      else {
        this.update();
      }
    }
  }

  load() {
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
  }

  initPolling() {
    this._interval = setInterval( () => this.load() , this._intervalTime );
  }

  routerOnActivate( current: RouteSegment ) {
    this.selectedResource = current.getParam( 'resource' );
    this.selectedName     = decodeURIComponent( current.getParam( 'name' ) );

    if ( this.selectedName && this.selectedName != 'undefined' ) {
      this.load();
      // this.initPolling();
    } else {
      this.isNewArtifact = true;
      this.selectedName = 'new ' + this.selectedResource.slice( 0 , -1 );
    }
  }

  save() {
    this._artifacts[ this.selectedResource ].add( this.content , { headers : { 'Content-Type' : 'application/x-yaml' } } )
      // .first()
      .subscribe(
        res => {
          this._notifier.addNotification( {
            message: `Succesfully added new ${ this.selectedResource.slice( 0 , -1 ) } "${ res[0].name }"`,
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
  }

  update() {
    this._artifacts[ this.selectedResource ].update( this.resource , this.content , { headers : { 'Content-Type' : 'application/x-yaml' } } )
      // .first()
      .subscribe(
        res => {
          this._notifier.addNotification( {
            message: `Succesfully updated ${ this.selectedResource.slice( 0 , -1 ) } "${ res[0].name }"`,
            type: 'success'
          } );
          this._router.navigate(['/', this.selectedResource , encodeURIComponent( res[0].name ) ]);
        },
        err => {
          this._notifier.addNotification( {
            message: `Failed to update ${ this.selectedResource.slice( 0 , -1 ) } because: "${ err }"`,
            type: 'error'
          } );
        }
      );
  }

  _onError( error ) {
    let message = error;

    return Observable.throw( message );
  }

}
