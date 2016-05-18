import {Inject,Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable'

import {ApiService} from './api.service';

declare var EventSource:any;

@Injectable()
export class EventsService {
  // The EvenStream service listens to the VAMP SSE enpoint for all events
  // and allows other services/components to subscribe to certain types of events.
  // The use-case for this service in VAMP's case is that the Artifact-specific
  // stores can subscribe to relevant events and process the data through
  // the update() method with the specific parameters.

  // Example: register an event in the DeploymentStore
  // dependency: newEventSteam
  // 1. first argument is the event on the SSE stream which is listend to. This
  //    is `data` by default but in the case of vamp we support 'event' and
  //    'gateway-metrics'
  // 2. second argument is an optionial filter which could be applied to the listener
  // 3. last argument is the data recieved from the SSE stream.
  // ex:
  // newEventSteam.listen( 'event' , { tags: [] } , data => {
  //   // this refers to the service into which the EventSream is injected
  //   this.update( artifact || id , data );
  // })
  //
  // In theory we could omit the data response from the listen fn if the second
  // parameter in Store.update is `data` by default but makes for less clear code.
  // JS should auto-hoist this var from the response:
  // newEventSteam.listen( 'event' , { tags: [] } , this.update( artifact || id );

  private _endpoint:string = 'http://192.168.99.100:8080/api/v1/events/stream';

  private _source:any;

  // The subscriptions object (not used)
  private _subscriptions = {};

  // On init we expect the following parameters:
  // 1. the endpoint; default is given above.
  constructor(
    @Inject( ApiService ) public _api?
  ) {
    this._endpoint = this._api._endpoint + 'events/stream';

    this._source = new EventSource( this._endpoint );

    console.log( 'Init SSE with' , this._source );
  }

  //
  listen( type , tags:Array<string> , callback ) {
    this._source.addEventListener( type , event => {
      let data    = JSON.parse( event.data ),
          hasTags = false;

      console.log( 'Fetched event with' , data );

      if ( data && data.tags ) {
        tags.forEach( tag => {
          hasTags = data.tags.indexOf( tag ) !== -1
        } )
      }

      if ( hasTags )
        callback( data );
    } );
  }

  remove( type , callback ) {
    this._source.removeEventListener( type , callback );
  }

}
