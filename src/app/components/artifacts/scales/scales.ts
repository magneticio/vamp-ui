import {Component , provide} from 'angular2/core';

import {newApiService} from '../../../services/api/api'
import {Store} from '../../../services/store/store'

@Component({
  selector: 'vamp-scales',
  templateUrl: 'app/components/artifacts/scales/scales.html',
  styleUrls: ['app/components/artifacts/scales/scales.css'],
  providers: [
    provide( Store , {
      useFactory: newApiService => {
        return new Store( 'scales' , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] , newApiService );
      },
      deps: [ newApiService ]
    } )
  ],
  directives: [],
  pipes: []
})

export class Scales {
  // Add requirements specific to Blueprints here.
  constructor( private _store : Store ) {
    this._store = _store;
  }

  get scales() {
    return this._store.items$.getValue();
  }
}
