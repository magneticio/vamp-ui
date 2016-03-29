import {Component , provide} from 'angular2/core';

import {newApiService} from '../../../services/api/api'
import {Store} from '../../../services/store/store'

@Component({
  selector: 'vamp-blueprints',
  templateUrl: 'app/components/artifacts/blueprints/blueprints.html',
  styleUrls: ['app/components/artifacts/blueprints/blueprints.css'],
  providers: [
    provide( Store , {
      useFactory: newApiService => {
        return new Store( 'blueprints' , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] , newApiService );
      },
      deps: [ newApiService ]
    } )
  ],
  directives: [],
  pipes: []
})

export class Blueprints {
  // Add requirements specific to Blueprints here.
  constructor( private _store : Store ) {
    this._store = _store;
  }

  get blueprints() {
    return this._store.items$.getValue();
  }

  // This could add a cluster by providing a name and a JSON object.
  addCluster( name:string , data:Object ) {}
}
