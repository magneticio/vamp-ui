import {Injectable} from 'angular2/core';


@Injectable()
export class Store {

  // Store needs an observable which provides a data stream corresponding to
  // the artifact whith which it is initialized.
  private storeObserver:any

  // Store provides public access to artifacts
  public dataStore:any

  // On initialization of the Store the following parameters are expected:
  // 1. an API coupling with the correct method names. (private)
  // 2. the name and/or interface of the VAMP artifact onto which this
  //    store will be modelled.
  constructor( ) {

  }

  // 1. This adds an artifact of the initialized type to the store
  // 2. It communicates the newly added artifact to the API
  // 3. The Store publishes the newly added artifact to the observer
  add() {
    // if ( capabilites.indexOf( 'POST' ) !== -1 )
    //   return null;


  }

  // 1. This removes an artifact of the initialized type from the store
  // 2. It communicates the newly deleted artifact to the API
  // 3. The Store notifes the observer of the remvoval
  delete() {}

  // 1. Retrieve a single artifact from the store
  // 2. (optionally) GET's the single artifact from the API
  // Q:
  get() {}

  // 1. Updates an existing artifact in the store
  // 2. Communicates the udpated artifact to the API service
  update() {}
}

// We add custom functions to each of the artifact types based on extending the
// Store class like so:
export class BlueprintStore extends Store {
  private capabilites:Array<string> = [ 'GET' , 'POST' , 'PUT' , 'DELETE' ];

  // Add requirements specific to Blueprints here.
  constructor() {
    super();

    //api.capabilites( this.capabilites );
  }

  // This could add a cluster by providing a name and a JSON object.
  addCluster( name:string , data:Object ) {}
}

export class GatewayStore extends Store {} //etc.

// Ideally we put all these classes in their own files, regardless of size, for
// better code organization.
