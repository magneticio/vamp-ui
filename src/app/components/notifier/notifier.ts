import {Component,Inject} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {Notification,NotificationStore} from '../../services/store/notifications';

@Component({
  selector: 'vamp-notifier',
  templateUrl: 'app/components/notifier/notifier.html',
  providers: [ NotificationStore ],
  directives: [],
  pipes: []
})

export class Notifier {

  constructor(
    private _store : NotificationStore
  ) {
    console.log( this );
  }

  get notifications() {
    return this._store.items;
  }

  add( notification : Notification ) {
    this._store.addNotification( notification );
  }

  // Adds a notification to the notifier which stays live for ~5 seconds
  remove( notification : Notification ) {
    this._store.delete( notification );
  }

  ngOnInit() {
    this.add( { message: 'Vamp notifier initialized!' , type: 'info' } );
  }

}
