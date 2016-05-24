import {Inject , Injectable} from '@angular/core';

import {ApiService} from '../shared/api.service';
import {EventsService} from '../shared/events.service';
import {NotificationsService} from '../shared/notifications.service';
import {StoreService} from '../shared/store.service';

@Injectable()
export class Deployments extends StoreService {
  // Add requirements specific to Blueprints here.
  constructor(
    @Inject( ApiService ) public _api,
    @Inject( EventsService ) private _events,
    @Inject( NotificationsService ) private _notifier
  ) {
    super( 'deployments' , _api , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] );
  }

  undeploy( item ) {
    this._api.get( 'deployments' , item.name , { search: 'as_blueprint=true' } )
      .subscribe(
        res => {
          let name = item.name;//res.name || res.map( val => val.name ).join(', ');

          this.delete( item , { body: res } )
            .subscribe();

          this._notifier.addNotification( {
            message: `Succesfully undeployed ${ name }`,
            type: 'info'
          } )
        },
        err => {
          this._notifier.addNotification( {
            message: `Could not undeploy ${ item.name }: ${ err }`,
            type: 'error'
          } )
        }
      );
  }

  get deployments() {
    return this.items;
  }
}
