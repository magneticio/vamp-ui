import {Component , provide} from 'angular2/core';

import {newApiService} from '../../../services/api/api'
import {Store} from '../../../services/store/store'

@Component({
  selector: 'vamp-filters',
  templateUrl: 'app/components/artifacts/filters/filters.html',
  styleUrls: ['app/components/artifacts/filters/filters.css'],
  providers: [
    provide( Store , {
      useFactory: newApiService => {
        return new Store( 'filters' , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] , newApiService );
      },
      deps: [ newApiService ]
    } )
  ],
  directives: [],
  pipes: []
})

export class Filters {
  // Add requirements specific to Blueprints here.
  constructor( private _store : Store ) {
    this._store = _store;
  }

  get filters() {
    return this._store.items$.getValue();
  }
}
