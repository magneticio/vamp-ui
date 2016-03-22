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
