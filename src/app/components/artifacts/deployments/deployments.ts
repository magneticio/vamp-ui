import {Component , Inject , Injectable , provide} from 'angular2/core';

import {newApiService} from '../../../services/api/api';
import {newEventStream} from '../../../services/event-stream/event-stream';
import {NotificationStore} from '../../../services/store/notifications';
import {Store} from '../../../services/store/store';

// @Component({
//   selector: 'vamp-deployments',
//   templateUrl: 'app/components/artifacts/deployments/deployments.html',
//   styleUrls: ['app/components/artifacts/deployments/deployments.css'],
//   providers: [
//     // TODO: figure out whether we need to initialze new stores on the provide of
//     // these components or whether we want to abstract the artifact-specific stores
//     // into their own services which extend the default store class.
//     provide( Store , {
//       useFactory: newApiService => {
//         return new Store( 'deployments' , newApiService , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] );
//       },
//       deps: [ newApiService ]
//     } )
//   ],
//   directives: [],
//   pipes: []
// })

@Injectable()
export class Deployments extends Store {
  // Add requirements specific to Deployments here.
  constructor(
    @Inject( newApiService ) _api,
    @Inject( newEventStream ) private _events,
    @Inject( NotificationStore ) private _notifier
  ) {
    super( 'deployments' , _api , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] );

    this._events.listen( 'event' , ['deployments:','synchronization:undeployed'] , data => {
      this._notifier.addNotification( { message: data.value['_1'].name + ' is undeployed' , type: 'info' } );
    } )
  }

  undeploy( item ) {
    this._api.get( 'deployments' , item.name , { search: 'as_blueprint=true' } )
      .subscribe( res => {
        this.delete( item , { body: res } )
      } );
  }

  get deployments() {
    return this.items;
  }
}
