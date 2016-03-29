import {Component , provide} from 'angular2/core';

import {newApiService} from '../../../services/api/api'
import {Store} from '../../../services/store/store'

@Component({
  selector: 'vamp-workflows',
  templateUrl: 'app/components/artifacts/workflows/workflows.html',
  styleUrls: ['app/components/artifacts/workflows/workflows.css'],
  providers: [
    provide( Store , {
      useFactory: newApiService => {
        return new Store( 'workflows' , newApiService , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] );
      },
      deps: [ newApiService ]
    } )
  ],
  directives: [],
  pipes: []
})

export class Workflows {
  // Add requirements specific to Blueprints here.
  constructor( private _store : Store ) {
    this._store = _store;
  }

  get workflows() {
    return this._store.items$.getValue();
  }
}
