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

    this._events.listen( 'event' , ['deployments:','synchronization:undeployed'] , data => {
      this._notifier.addNotification( { message: data.value['_1'].name + ' is undeployed' , type: 'info' } );
    } )
  }

  undeploy( item ) {
    this._api.get( 'deployments' , item.name , { search: 'as_blueprint=true' } )
      .subscribe( res => {
        this.delete( item , { body: res } )
          .subscribe();
      } );
  }

  get deployments() {
    return this.items;
  }
}
