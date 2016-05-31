import { Component, Input, OnInit } from '@angular/core';

import {ApiService} from '../shared/api.service';
import {NotificationsService} from '../shared/notifications.service';

@Component({
  moduleId: module.id,
  selector: 'vamp-info',
  templateUrl: 'info.component.html',
  styleUrls: ['info.component.css']
})
export class InfoComponent implements OnInit {

  content;
  endpoint;
  @Input() isActive = false;

  protected _interval;
  protected _intervalTime = 30000; // 30s
  protected _timeout;

  constructor(
    private _api : ApiService,
    private _notifier : NotificationsService
  ) {
    this.endpoint = this._api._endpoint;
  }

  load() {
    this.content = this._api.getAll( 'info' , { headers: { 'Accept' : 'application/x-yaml' } } )
      .subscribe(
        res => {
          this.content = res;

          if ( this._notifier.get( 'connectionError' ) )
            this._notifier.delete( 'connectionError' );

          if ( !this._interval )
            this.initPolling();
        },
        err => {
          this._notifier.add( {
            message : `Could not connect to the VAMP instance at ${ this.endpoint }`,
            name    : 'connectionError',
            type    : 'error'
          } )

          // Up the polling frequency when we can't connect to the API.
          clearTimeout( this._timeout );
          this._timeout = setTimeout( () => this.load() , this._intervalTime / 10 );
        }
      );
  }

  initPolling() {
    this._interval = setInterval( () => this.load() , this._intervalTime );
  }

  onEndpointChange( endpoint ) {
    console.log( this , endpoint );
    this.endpoint = this._api._endpoint = endpoint;
  }

  ngOnInit() {
    this.load();
    this.initPolling();
  }

}
