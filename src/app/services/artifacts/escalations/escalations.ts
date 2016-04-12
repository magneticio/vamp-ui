import {Component , provide} from 'angular2/core';

import {newApiService} from '../../../services/api/api'
import {Store} from '../../../services/store/store'

@Component({
  selector: 'vamp-escalations',
  templateUrl: 'app/components/artifacts/escalations/escalations.html',
  styleUrls: ['app/components/artifacts/escalations/escalations.css'],
  providers: [
    provide( Store , {
      useFactory: newApiService => {
        return new Store( 'escalations' , newApiService , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] );
      },
      deps: [ newApiService ]
    } )
  ],
  directives: [],
  pipes: []
})

export class Escalations {
  // Add requirements specific to Blueprints here.
  constructor( private _store : Store ) {
    this._store = _store;
  }

  get escalations() {
    return this._store.items$.getValue();
  }
}
