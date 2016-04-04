import {Inject,Injectable} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Http, RequestOptions , RequestOptionsArgs, Response, Headers} from 'angular2/http'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';



function serializeParams( params : RequestOptionsArgs = {} ) {
  const defaults = {
    'Content-Type' : 'application/json'
  };

  console.log( params );

  let { body }    = params,
      { headers } = params;

  if ( typeof body !== 'string' )
    params.body = JSON.stringify( body );

  if ( ! headers )
    params.headers = new Headers( defaults );

  if ( ! params.headers.has( 'Content-Type' ) )
    params.headers.set( 'Content-Type' , defaults['Content-Type'] );

  console.log( params );

  return new RequestOptions( params );
}

// Adapted from https://github.com/MikaAK/angular2-api/blob/master/src/ApiService.ts
function deserializeResponse( response : Response ) {
  let contentType = response && response.headers && (response.headers.get('content-type') || response.headers.get('Content-Type'));

  if (/json/.test(contentType))
    return response.json();
  else if (/text/.test(contentType))
    return response.text();
  else if (/blob/.test(contentType))
    return response.blob();

  return response
}

// New API
@Injectable()
export class newApiService {

  public _endpoint = 'http://192.168.99.100:8080/api/v1/';
  private _http : Http;

  constructor( @Inject( Http ) Http ) {
    this._http = Http;
  }

  getAll( artifact:string ) {
    return this._http.get( this._endpoint + artifact , serializeParams() )
      .map( deserializeResponse )
      .share();
  }

  get( artifact:string , id:string ) {
    return this._http.get( this._endpoint + artifact + '/' + id , serializeParams() )
      .map( deserializeResponse )
  }

  post( artifact:string , id:string , payload ) {
    return this._http.post( this._endpoint + artifact + ( id ? '/' + id : '' ) , JSON.stringify( payload ) , serializeParams() )
      .map( deserializeResponse )
      .share();
  }

  put( artifact:string , id:string , payload ) {
    return this._http.put( this._endpoint + artifact + '/' + id , JSON.stringify( payload ) , serializeParams() )
      .map( deserializeResponse )
      .share();
  }

  delete( artifact:string , id:string , payload = null ) {
    let params = { body : payload };

    return this._http.delete( this._endpoint + artifact + '/' + id , serializeParams( params ) )
      .map( deserializeResponse )
      .share();
  }

}

// !! DEPRECATED !!
// The code below is deprecated but we need it for legacy reasons during the
// refactor of the crud-list components into the vamp-specific components.
// const serializeParams = (params: any = {}) => {
//   if (!params.headers)
//     params.headers = new Headers({'Content-Type': 'applications/json'})
//
//   return params
// }

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
