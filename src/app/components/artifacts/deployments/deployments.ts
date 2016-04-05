import {Component , provide} from 'angular2/core';

import {newApiService} from '../../../services/api/api'
import {Store} from '../../../services/store/store'

@Component({
  selector: 'vamp-deployments',
  templateUrl: 'app/components/artifacts/deployments/deployments.html',
  styleUrls: ['app/components/artifacts/deployments/deployments.css'],
  providers: [
    provide( Store , {
      useFactory: newApiService => {
        return new Store( 'deployments' , newApiService , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] );
      },
      deps: [ newApiService ]
    } )
  ],
  directives: [],
  pipes: []
})

export class Deployments {
  // Add requirements specific to Deployments here.
  constructor(
    private _store : Store
  ) { }

  undeploy( item ) {
    this._store._api.get( 'deployments' , item.name , { search: 'as_blueprint=true' } )
      .subscribe( res => this._store.delete( item , { body: res } ) );
  }

  get deployments() {
    return this._store.items$.getValue();
  }
}
