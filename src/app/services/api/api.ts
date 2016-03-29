import {Injectable} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Http, RequestOptionsArgs, Response, Headers} from 'angular2/http'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

const serializeParams = (params: any = {}) => {
  if (!params.headers)
    params.headers = new Headers({'Content-Type': 'applications/json'})

  return params
}

const deserializeResponse = (resp: Response) => {
  let contentType = resp && resp.headers && (resp.headers.get('content-type') || resp.headers.get('Content-Type'))

  if (!contentType)
    return resp

  if (/json/.test(contentType))
    return resp.json()
  else if (/text/.test(contentType))
    return resp.text()
  else if (/blob/.test(contentType))
    return resp.blob()
  else
    return resp
}

export class Api {
  constructor( public name: string) { }
}

@Injectable()
export class ApiService {

  public _endpoint = 'http://192.168.99.100:8080/api/v1/'

  items$: Observable<Array<any>>;
  private _itemsObserver: any;
  private _dataStore: {
      items: Array<any>
  };

  constructor( private _http: Http ) {

    this.items$ = new Observable(
      observer => this._itemsObserver = observer
    ).share();
    this._dataStore = { items: [] };

  }

  getAll( resource:string ) {
    return this._http.get( this._endpoint + resource )
      .map( res => res.json() )
      .subscribe(
        data => {

          // Update data store
          this._dataStore.items = data;

          // Push new items into the Observable stream
          this._itemsObserver.next(this._dataStore.items);

        },
        error => this.handleError(error),
        () => console.log('GetAll complete', resource, this._dataStore.items)
      );
  }

  getInfo() {
    return this._http.get( this._endpoint + 'info' )
      .map( res => res.json() )
  }

  get(resource:string, name:string) {
      /*this._http.get( this._endpoint + resource + '/' + name).subscribe(
        response => {
            this._dataStore.items.forEach((t, index) => {
                console.log(t);
                if (t.name === name) { console.log('Found!'); this._dataStore.item = this._dataStore.items[index]; }
            });
        },
        error => this.handleError(error),
        () => console.log('Get complete', resource, this._dataStore.item)
      )*/
  }

  post( resource:string, req ) {
    return this._http.post( this._endpoint + resource , req )
      .map( res => res.json() )
  }

  put( resource:string, req ) {
    return this._http.put( this._endpoint + resource , req )
    .map( res => res.json() )
  }

  /*delete( resource:string ) {
    return this._http.delete( this._endpoint + resource )
      .map( res => res.json() )
  }*/

  delete(resource:string, id:string) {
      this._http.delete(this._endpoint + resource + '/' + id).subscribe(
        response => {
            this._dataStore.items.forEach((t, index) => {
                if (t.name === id) { this._dataStore.items.splice(index, 1); }
            });
            this._itemsObserver.next(this._dataStore.items);
        },
        error => this.handleError(error),
        () => console.log('Delete complete', resource, id)
      )
  }

  handleError(error) {
    console.log('Error', error);
  }
}
