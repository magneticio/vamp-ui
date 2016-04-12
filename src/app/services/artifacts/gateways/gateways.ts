import {Component , Inject , Injectable , provide} from 'angular2/core';

import {newApiService} from '../../../services/api/api';
import {newEventStream} from '../../../services/event-stream/event-stream';
import {NotificationStore} from '../../../services/store/notifications';
import {Store} from '../../../services/store/store';

// @Component({
//   selector: 'vamp-gateways',
//   templateUrl: 'app/components/artifacts/_partials/list.html',
//   styleUrls: ['app/components/artifacts/gateways/gateways.css'],
//   providers: [
//     provide( Store , {
//       useFactory: newApiService => {
//         return new Store( 'gateways' , newApiService , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] );
//       },
//       deps: [ newApiService ]
//     } )
//   ],
//   directives: [],
//   pipes: []
// })

@Injectable()
export class Gateways extends Store {
  // Add requirements specific to Blueprints here.
  constructor(
    @Inject( newApiService ) _api,
    @Inject( newEventStream ) private _events,
    @Inject( NotificationStore ) private _notifier
  ) {
    super( 'gateways' , _api , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] )
  }

  get gateways() {
    return this.items;
  }
}
