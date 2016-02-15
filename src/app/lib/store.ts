import { Injectable } from 'angular2/core'
import { Observable } from 'rxjs/Rx'
import { Api } from './api'

@Injectable()
export class Store {

  deployments : Observable<Array<any>>
  gateways    : Observable<Array<any>>

  constructor( private _api: Api ) {
    this.initPolling( 'deployments' )
    this.initPolling( 'gateways' )
  }

  initPolling( type: string ) {
    return Observable.interval( 1000 )
      .flatMap( () => {
        return this._api.get( type )
      })
      .subscribe(
        data  => this[ type ] = data,
        error => console.log( 'Errorred with' , error )
      );
  }

}
