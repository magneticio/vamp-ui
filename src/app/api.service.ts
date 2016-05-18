import { Inject , Injectable } from '@angular/core';
import { Http, RequestOptions , RequestOptionsArgs, Response, Headers , URLSearchParams} from '@angular/http'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

function serializeParams( params : RequestOptionsArgs = {} ) {
  const defaults = {
    'Content-Type' : 'application/json'
  };

  let { body }    = params,
      { headers } = params;

  params.headers = new Headers( headers || defaults );

  if ( typeof body !== 'string' )
    params.body = JSON.stringify( body );

  if ( ! params.headers.has( 'Content-Type' ) )
    params.headers.set( 'Content-Type' , defaults['Content-Type'] );

  return new RequestOptions( params );
}

// Adapted from https://github.com/MikaAK/angular2-api/blob/master/src/ApiService.ts
function deserializeResponse( response : Response ) {
  let contentType = response && response.headers && (response.headers.get('content-type') || response.headers.get('Content-Type'));

  if ( /json/.test(contentType) )
    return response.json();
  else if ( /text/.test(contentType) || /yaml/.test(contentType) )
    return response.text();
  else if ( /blob/.test(contentType) )
    return response.blob();

  return response
}

// New API
// TODO: refactor the params to proper request objects.
@Injectable()
export class ApiService {

  public _endpoint = 'http://192.168.99.100:8080/api/v1/';
  private _http : Http;

  constructor( @Inject( Http ) Http ) {
    this._http = Http;
  }

  getAll( artifact:string ) {
    return this._http.get( this._endpoint + artifact , serializeParams() )
      .map( deserializeResponse )
      .catch( this._onError )
      .share();
  }

  get( artifact:string , id:string , params? ) {
    return this._http.get( this._endpoint + artifact + '/' + encodeURIComponent( id ) , serializeParams( params ) )
      .map( deserializeResponse )
      .catch( this._onError )
  }

  post( artifact:string , id:string , payload , params ) {
    if ( typeof payload !== 'string' )
      payload = JSON.stringify( payload );

    return this._http.post( this._endpoint + artifact + ( id ? '/' + encodeURIComponent( id ) : '' ) , payload , serializeParams( params ) )
    // .catch( this._onError )
      .map( deserializeResponse )
      .catch( this._onError )
      .share();
  }

  put( artifact:string , id:string , payload , params ) {
    if ( typeof payload !== 'string' )
      payload = JSON.stringify( payload );

    return this._http.put( this._endpoint + artifact + '/' + encodeURIComponent( id ) , payload , serializeParams( params ) )
      .map( deserializeResponse )
      .catch( this._onError )
      .share();
  }

  delete( artifact:string , id:string , params ) {
    return this._http.delete( this._endpoint + artifact + '/' + encodeURIComponent( id ) , serializeParams( params ) )
      .map( deserializeResponse )
      .catch( this._onError )
      .share();
  }

  _onError( response: any ) {
    let error   = deserializeResponse( response )
      , message = error.message || error.statusText || 'Server error';

    console.error( message );

    return Observable.throw( message );
  }

}
