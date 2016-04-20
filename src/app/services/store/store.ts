import {Inject,Injectable,Optional} from 'angular2/core';
import {BehaviorSubject, Observable , Subject} from 'rxjs/Rx';

import {newApiService} from '../api/api'

function asObs( subject ) {
  return new Observable( fn => subject.subscribe( fn ) );
}

@Injectable()
export class Store {
  // TODO: Respearch whether we could implement the API communication on the
  // observer instead of in the store methods. Seems like a more proper way
  // to deal with the observavle BehaviorSubject.

  protected _artifact : string
  protected _capabilities : Array<string> = [ 'GET' , 'POST' , 'PUT' , 'DELETE' ];

  // Store needs an observable which provides data corresponding to
  // the artifact(s) whith which it is initialized.
  public items$ : BehaviorSubject<Array<any>> = new BehaviorSubject([]);

  // On initialization of the Store the following parameters are expected:
  // 1. an API coupling with the correct method names. (private)
  // 2. the name and/or interface of the VAMP artifact onto which this
  //    store will be modelled.
  constructor(
    _artifact : string,
    @Inject( newApiService ) public _api?,
    _capabilities? : Array<string>
  ) {
    this._artifact = _artifact;
    this._capabilities = _capabilities || this._capabilities;

    if ( this._api )
      this.load();

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

  // 1. This adds an artifact of the initialized type to the store
  // 2. It communicates the newly added artifact to the API
  // 3. The Store publishes the newly added artifact to the observer
  add( artifact , params = {} ) {
    if ( ! this._can( 'POST' ) || this.find( artifact ) )
      return null;

    console.log( 'Adding' , artifact , 'to' , this._artifact );

    let items = this.items$.getValue();
    items.push( artifact );

    if ( this._api )
      this._api.post( this._artifact , null , artifact , params )
        .subscribe( res => this.items$.next( items ) );

    return artifact;
  }

  // 1. This removes an artifact of the initialized type from the store
  // 2. It communicates the newly deleted artifact to the API
  // 3. The Store notifes the observer of the remvoval
  delete( artifact , params = {} ) {
    if ( ! this._can( 'DELETE' ) )
      return null;

    let items = this.items$.getValue(),
        item  = this.find( artifact );

    if ( item ) {
      items.splice( items.indexOf( item ) , 1 );

    if ( item && this._api )
      this._api.delete( this._artifact , item.name , params )
        .subscribe( res => this.items$.next( items ) );
    }

    return item;
  }

  // Helper method to query for artifacts in the store.
  find( val , property = 'name' ) {
    let items = this.items$.getValue(),
        item  = null,
        found = items.indexOf( val );

    if ( found !== -1 )
      return items[ found ];
    else
      found = null;

    for ( let item of items ) {
      if ( item[ property ] == val )
	      found =  item;
    }

    return found;
  }

  // 1. Retrieve a single artifact from the store
  // 2. (optionally) GET's the single artifact from the API
  // Q:
  get( artifact , params = {} ) {
    if ( ! this._can( 'GET' ) )
      return null;

    // let item  = typeof artifact === 'number' ? this.items,
    let items = this.items$.getValue(),
        item  = this.find( artifact );

    if ( this._api )
      this._api.get( this._artifact , item.name , params )
        .subscribe( res => {
          Object.assign( item , res );
          this.items$.next( items );
        } );

    return item;
  }

  // 1. Updates an existing artifact in the store
  // 2. Communicates the udpated artifact to the API service
  update( artifact , payload = null , params = {} ) {
    if ( ! this._can( 'PUT' ) )
      return null;

    let items = this.items$.getValue(),
        item  = this.find( artifact );

    if ( item ) {
      Object.assign( item , artifact );

      if ( this._api )
        this._api.put( this._artifact , artifact.name , payload , params )
          .subscribe( res => this.items$.next( items ) );
    }

    return item;
  }


  // Helper methods to this class
  _can( capability:string ) {
    return this._capabilities.indexOf( capability ) !== -1;
  }

}
