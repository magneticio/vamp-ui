import {Inject , Injectable} from '@angular/core';

import {ApiService} from '../shared/api.service';
import {EventsService} from '../shared/events.service';
import {NotificationService} from '../shared/notifications.service';
import {StoreService} from '../shared/store.service';

@Injectable()
export class Breeds extends StoreService {
  // Add requirements specific to Blueprints here.
  constructor(
    @Inject( ApiService ) public _api,
    @Inject( EventsService ) private _events,
    @Inject( NotificationService ) private _notifier
  ) {
    super( 'breeds' , _api , [ 'GET' , 'POST' , 'PUT' , 'DELETE' ] );
  }

  get breeds() {
    return this.items;
  }
}
