import {Component , provide} from 'angular2/core';

import {newApiService} from '../../../services/api/api'
import {Store} from '../../../services/store/store'

@Component({
  selector: 'vamp-blueprints',
  templateUrl: 'app/components/artifacts/_partials/list.html',
  styleUrls: ['app/components/artifacts/blueprints/blueprints.css'],
  providers: [
    newApiService,
    provide( Store , {
      useFactory: newApiService => {
        return new Store( 'blueprints' , newApiService , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] );
      },
      deps: [ newApiService ]
    } )
  ],
  directives: [],
  pipes: []
})

export class Blueprints {
  // Add requirements specific to Blueprints here.
  constructor(
    private _store : Store,
    private _api   : newApiService
  ) {
    this._store = _store;
  }

  get blueprints() {
    return this._store.items;
  }

  // Deploy method calls the api to create a deployment from the corresponding
  // blueprint.
  // TODO: Use the generated Deploymentstore to add the blueprint as deployment
  // instead of injecting the API service here.
  deploy( item ) {
    return this._api.post( 'deployments' , null , JSON.stringify( item ) )
      .subscribe();
  }

  // This could add a cluster by providing a name and a JSON object.
  addCluster( name:string , data:Object ) {}
}
