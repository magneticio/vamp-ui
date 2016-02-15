import { Injectable } from 'angular2/core'
import { Http } from 'angular2/http'
import 'rxjs/add/operator/map'

@Injectable()

export class Api {

  protected _endpoint = 'http://192.168.99.100:8080/api/v1/';

  constructor( private _http: Http ) {}

  get( type: string ) {
    return this._http.get( this._endpoint + type )
      .map( res => res.json() );
  }

}
