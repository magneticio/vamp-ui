import {Injectable} from 'angular2/core';
import {Http, RequestOptionsArgs, Response, Headers} from 'angular2/http'
import {Observable} from 'rxjs/Observable'

// Declare EventSource object as magic
declare var EventSource:any;

@Injectable()
export class EventStream {

  protected _endpoint = 'http://192.168.99.100:8080/api/v1/';

  events$: Observable<Array<any>>;
  private _eventObserver: any;
  private _eventStore: {
      items: Array<any>
  };

  metrics$: Observable<Array<any>>;
  private _metricObserver: any;
  private _metricStore: {
      items: Array<any>
  };

  constructor(
    private _http: Http
  ) {

    this.events$ = new Observable(
      observer => this._eventObserver = observer
    ).share();
    this._eventStore = { items: [] };

    this.metrics$ = new Observable(
      observer => this._metricObserver = observer
    ).share();
    this._metricStore = { items: [] };

  }

  listen() {

    var source = new EventSource(this._endpoint + 'events/stream');

    source.addEventListener('event', e => {

      // EmitEvents with data
    
      // Deploying/undeploying
      //console.log('eventStream:event', e.data);
      this._eventStore.items.push(JSON.parse(e.data));
      this._eventObserver.next(this._eventStore.items);
    }, false);

    source.addEventListener('gateway-metrics', e => {
      // Metrics
      //console.log('eventStream:metric', e.data);
      this._metricStore.items.push(JSON.parse(e.data));
      this._metricObserver.next(this._metricStore.items);
    }, false);

    source.addEventListener('open', function(e) {
      //console.log('eventStream opened…');
    }, false);

    source.addEventListener('error', function(e) {
      //console.log('eventStream errored…');
      if (e.readyState == EventSource.CLOSED) {
        //console.log('eventStream closed…');
      }
    }, false);
  }

}


@Injectable()
export class newEventSteam {
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
  // parameter in Store.update is `data` by default but makes for les clear code.
  // JS should auto-hoist this var from the response:
  // newEventSteam.listen( 'event' , { tags: [] } , this.update( artifact || id );

  private _endpoint = 'http://192.168.99.100:8080/api/v1/events/stream';

  // The subscriptions object
  private _subscriptions = {};

  // On init we expect the following parameters:
  // 1. the endpoint; default is given above.
  constructor() {}

  //
  listen() {}

}
