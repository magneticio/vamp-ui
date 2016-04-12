import {Component , provide} from 'angular2/core';

import {newApiService} from '../../../services/api/api'
import {Store} from '../../../services/store/store'

@Component({
  selector: 'vamp-slas',
  templateUrl: 'app/components/artifacts/slas/slas.html',
  styleUrls: ['app/components/artifacts/slas/slas.css'],
  providers: [
    provide( Store , {
      useFactory: newApiService => {
        return new Store( 'slas' , newApiService , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] );
      },
      deps: [ newApiService ]
    } )
  ],
  directives: [],
  pipes: []
})

export class Slas {
  // Add requirements specific to Blueprints here.
  constructor( private _store : Store ) {
    this._store = _store;
  }

  get slas() {
    return this._store.items$.getValue();
  }
}
