import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { StoreService } from './store.service';

export interface Notification {
  message : string,
  type?   : string
}

@Injectable()
export class NotificationService extends StoreService {

  public items$ : BehaviorSubject<Array<Notification>> = new BehaviorSubject([]);
  public timeoutDuration : number = 6000;

  constructor() {
    super( 'notifications' );
  }

  addNotification( notification : Notification ) {
    this.add( notification );

    setTimeout( () => this.delete( notification ) , this.timeoutDuration );
  }

}
