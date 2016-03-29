import {Inject,Injectable} from 'angular2/core';
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

  // Private api coupling
  private _api:newApiService

  // Store needs an observable which provides a data stream corresponding to
  // the artifact whith which it is initialized.
  public items$ : BehaviorSubject<Array<any>> = new BehaviorSubject([]);

  // On initialization of the Store the following parameters are expected:
  // 1. an API coupling with the correct method names. (private)
  // 2. the name and/or interface of the VAMP artifact onto which this
  //    store will be modelled.
  constructor(
    private _artifact:string,
    private _capabilities:Array<string> = [ 'GET' , 'POST' , 'PUT' , 'DELETE' ],
    @Inject( newApiService ) newApiService
  ) {
    this._api = newApiService;
    this.load();

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

    return this._api.post( this._artifact , null , JSON.stringify( artifact ) )
      .subscribe( res => this.items$.next( items ) );
  }

  // 1. This removes an artifact of the initialized type from the store
  // 2. It communicates the newly deleted artifact to the API
  // 3. The Store notifes the observer of the remvoval
  delete( id ) {
    if ( ! this._can( 'DELETE' ) )
      return null;

    let item  = this.find( id ),
        items = this.items$.getValue();

    if ( item ) {
      items.splice( item.index , 1 );
      return this._api.delete( this._artifact , id )
        .subscribe( res => this.items$.next( items ) );
    }
  }

  // Helper method to query for artifacts in the store.
  find( val , property = 'name' ) {
    let found = null,
        items = this.items$.getValue();

    for ( let item of items ) {
      if ( item[ property ] == val )
	      found = { index : items.indexOf( item ) , value :  item };
    }

    return found;
  }

  // 1. Retrieve a single artifact from the store
  // 2. (optionally) GET's the single artifact from the API
  // Q:
  get( id ) {
    if ( ! this._can( 'GET' ) )
      return null;

    let item  = this.find( id ),
        items = this.items$.getValue();

    this._api.get( this._artifact , id )
      .subscribe( res => {
        Object.assign( items[ item.index ] , res );
        this.items$.next( items );
      } );

    return item && item.value;
  }

  // 1. Updates an existing artifact in the store
  // 2. Communicates the udpated artifact to the API service
  update( id , artifact ) {
    if ( ! this._can( 'PUT' ) )
      return null;

    let item  = this.find( id ),
        items = this.items$.getValue();

    if ( item ) {
      Object.assign( items[ item.index ] , artifact );
      return this._api.put( this._artifact , id , artifact )
        .subscribe( res => this.items$.next( items ) );
    }
  }


  // Helper methods to this class
  _can( capability:string ) {
    return this._capabilities.indexOf( capability ) !== -1;
  }
}

// We add custom functions to each of the artifact types based on extending the
// Store class like so:

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

// Ideally we put all these classes in their own files, regardless of size, for
// better code organization.
