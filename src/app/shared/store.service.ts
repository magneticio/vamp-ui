import {Inject,Injectable} from '@angular/core';
import {BehaviorSubject, Observable , Subject} from 'rxjs/Rx';

import {ApiService} from './api.service'

function asObs( subject ) {
  return new Observable( fn => subject.subscribe( fn ) );
}

@Injectable()
export class StoreService {
  // TODO: Respearch whether we could implement the API communication on the
  // observer instead of in the store methods. Seems like a more proper way
  // to deal with the observavle BehaviorSubject.

  protected _artifact : string
  protected _capabilities : Array<string> = [ 'GET' , 'POST' , 'PUT' , 'DELETE' ];
  protected _interval;
  protected _intervalTime = 10000;

  // Store needs an observable which provides data corresponding to
  // the artifact(s) whith which it is initialized.
  public items$ : BehaviorSubject<Array<any>> = new BehaviorSubject([]);

  // On initialization of the Store the following parameters are expected:
  // 1. an API coupling with the correct method names. (private)
  // 2. the name and/or interface of the VAMP artifact onto which this
  //    store will be modelled.
  constructor(
    _artifact : string,
    @Inject( ApiService ) public _api?,
    _capabilities? : Array<string>
  ) {
    this._artifact = _artifact;
    this._capabilities = _capabilities || this._capabilities;

    if ( this._api ) {
      this.load();
      this.initPolling();
    }

    console.log( 'Init Store with' , this );
  }

  get items() {
    return asObs( this.items$ );
  }

  // Load all data from the Store's initialzed artifact
  load() {
    this._api.getAll( this._artifact )
      .subscribe( res => this.items$.next( res ) );
  }

  initPolling() {
    this._interval = window.setInterval( () => this.load() , this._intervalTime );
  }

  // 1. This adds an artifact of the initialized type to the store
  // 2. It communicates the newly added artifact to the API
  // 3. The Store publishes the newly added artifact to the observer
  add( artifact , params = {} ) {
    if ( ! this._can( 'POST' ) || this._find( artifact.name ) )
      return null;

    let items     = this.items$.getValue()
      , itemIndex = items.push( artifact ) - 1;

    if ( this._api )
      return this._api.post( this._artifact , null , artifact , params );
        // .subscribe( res => this.items$.next( items ) );

    return items[ itemIndex ];
  }

  // 1. This removes an artifact of the initialized type from the store
  // 2. It communicates the newly deleted artifact to the API
  // 3. The Store notifes the observer of the remvoval
  delete( artifact , params = {} ) {
    if ( ! this._can( 'DELETE' ) )
      return null;

    let items = this.items$.getValue(),
        item  = this._find( artifact.name );

    if ( item ) {
      items.splice( items.indexOf( item ) , 1 );

    if ( item && this._api )
      return this._api.delete( this._artifact , item.name , params );
        // .subscribe( res => this.items$.next( items ) );
    }

    return item;
  }

  // 1. Retrieve a single artifact from the store
  // 2. (optionally) GET's the single artifact from the API
  // Q:
  get( name , params = {} ) {
    if ( ! this._can( 'GET' ) )
      return null;

    // let item  = typeof artifact === 'number' ? this.items,
    let items = this.items$.getValue(),
        item  = this._find( name );

    if ( this._api )
      return this._api.get( this._artifact , name , params );
        // .subscribe( res => {
        //   Object.assign( item , res );
        //   this.items$.next( items );
        // } );

    return item;
  }

  // 1. Updates an existing artifact in the store
  // 2. Communicates the udpated artifact to the API service
  update( artifact , payload = null , params = {} ) {
    if ( ! this._can( 'PUT' ) )
      return null;

    let items = this.items$.getValue(),
        item  = this._find( artifact.name );

    if ( item ) {
      Object.assign( item , artifact );

      if ( this._api )
        return this._api.put( this._artifact , artifact.name , payload , params );
          // .subscribe( res => this.items$.next( items ) );

      this.items$.next( items )
    }

    return item;
  }


  // Helper methods to this class
  _can( capability:string ) {
    return this._capabilities.indexOf( capability ) !== -1;
  }

  // Helper method to query for artifacts in the store.
  _find( val , property = 'name' ) {
    let items = this.items$.getValue(),
        found = items.indexOf( val );

    if ( found !== -1 )
      return items[ found ];
    else
      found = null;

    for ( let item of items ) {
      if ( item && item[ property ] == val )
	      found = item;
    }

    return found;
  }

}
