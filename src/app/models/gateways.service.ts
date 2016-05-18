import {Inject , Injectable} from '@angular/core';

import {ApiService} from '../api.service';
import {EventsService} from '../events.service';
import {NotificationService} from '../notifications.service';
import {StoreService} from '../store.service';

@Injectable()
export class Gateways extends StoreService {
  // Add requirements specific to Blueprints here.
  constructor(
    @Inject( ApiService ) public _api,
    @Inject( EventsService ) private _events,
    @Inject( NotificationService ) private _notifier
  ) {
    super( 'gateways' , _api , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] )
  }

  get gateways() {
    return this.items;
  }
}
