import {Component , provide} from 'angular2/core';

import {newApiService} from '../../../services/api/api'
import {Store} from '../../../services/store/store'

@Component({
  selector: 'vamp-deployments',
  templateUrl: 'app/components/artifacts/_partials/list.html',
  styleUrls: ['app/components/artifacts/deployments/deployments.css'],
  providers: [
    provide( Store , {
      useFactory: newApiService => {
        return new Store( 'deployments' , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] , newApiService );
      },
      deps: [ newApiService ]
    } )
  ],
  directives: [],
  pipes: []
})

export class Deployments {
  // Add requirements specific to Blueprints here.
  constructor( private _store : Store ) {
    this._store = _store;
  }

  get deployments() {
    return this._store.items$.getValue();
  }
}
