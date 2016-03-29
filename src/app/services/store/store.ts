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

  // Store needs an observable which provides a data stream corresponding to
  // the artifact whith which it is initialized.
  public items$ : BehaviorSubject<Array<any>> = new BehaviorSubject([]);

  // On initialization of the Store the following parameters are expected:
  // 1. an API coupling with the correct method names. (private)
  // 2. the name and/or interface of the VAMP artifact onto which this
  //    store will be modelled.
  constructor(
    private _artifact:string,
    @Inject( newApiService ) private _api?,
    private _capabilities?:Array<string>
  ) {
    if ( this._api ) {
      this._capabilities  = [ 'GET' , 'POST' , 'PUT' , 'DELETE' ];
      this.load();
    }

    console.log( 'Init Store with' , _artifact , _capabilities , this );
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

  add( artifact ) {
    if ( ! this._can( 'POST' ) || this.find( artifact.name ) )
      return null;

    let items = this.items$.getValue(),
        item  = { index: items.push( artifact ) , value : artifact };

    if ( this._api )
      this._api.post( this._artifact , null , artifact )
        .subscribe( res => this.items$.next( items ) );

    return item;
  }

  // 1. This removes an artifact of the initialized type from the store
  // 2. It communicates the newly deleted artifact to the API
  // 3. The Store notifes the observer of the remvoval
  delete( artifact , withPayload = false ) {
    if ( ! this._can( 'DELETE' ) )
      return null;

    let items = this.items$.getValue(),
        item  = this.get( artifact );

    if ( item ) {
      items.splice( item.index , 1 );

    if ( item && this._api )
      this._api.delete( this._artifact , item.value.name , withPayload && item.value )
        .subscribe( res => this.items$.next( items ) );
    }

    return item;
  }

  // Helper method to query for artifacts in the store.
  find( val , property = 'name' ) {
    let found = null,
        items = this.items$.getValue(),
        item  = null;

    for ( let item of items ) {
      if ( item[ property ] == val )
	      found = { index : items.indexOf( item ) , value :  item };
    }

    return found;
  }

  // 1. Retrieve a single artifact from the store
  // 2. (optionally) GET's the single artifact from the API
  // Q:
  get( artifact ) {
    if ( ! this._can( 'GET' ) )
      return null;

    // let item  = typeof artifact === 'number' ? this.items,
    let items = this.items$.getValue(),
        item  = typeof artifact === 'number' ? items[ artifact ] : this.find( artifact.name );

    if ( this._api )
      this._api.get( this._artifact , artifact.name )
        .subscribe( res => {
          Object.assign( item , res );
          this.items$.next( items );
        } );

    return item;
  }

  // 1. Updates an existing artifact in the store
  // 2. Communicates the udpated artifact to the API service
  update( artifact ) {
    if ( ! this._can( 'PUT' ) )
      return null;

    let items = this.items$.getValue(),
        item  = this.get( artifact );

    if ( item ) {
      Object.assign( item , artifact );

      if ( this._api )
        this._api.put( this._artifact , artifact.name , artifact )
          .subscribe( res => this.items$.next( items ) );
    }

    return item;
  }


  // Helper methods to this class
  _can( capability:string ) {
    return this._capabilities.indexOf( capability ) !== -1;
  }

}

// export class BlueprintStore extends Store {
//
//   protected _capabilites = [ 'GET' , 'POST' , 'PUT' , 'DELETE' ];
//
//   // Add requirements specific to Blueprints here.
//   constructor() {
//     super( 'blueprint' );
//   }
//
//   get blueprints() {
//     return this._store$;
//   }
//
//   // This could add a cluster by providing a name and a JSON object.
//   addCluster( name:string , data:Object ) {}
// }
//
// export class GatewayStore extends Store {} //etc.
