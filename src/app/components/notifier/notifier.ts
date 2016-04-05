import {Component,Inject} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {newEventStream} from '../../services/event-stream/event-stream';
import {Notification,NotificationStore} from '../../services/store/notifications';

@Component({
  selector: 'vamp-notifier',
  templateUrl: 'app/components/notifier/notifier.html',
  providers: [ newEventStream , NotificationStore ],
  directives: [],
  pipes: []
})

export class Notifier {

  constructor(
    private _events: newEventStream,
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

    this._events.listen( 'event' , 'synchronization:deployed' , data => {
      this.add( { message: data.value['_1'].name + ' deployed' , type: 'info' } )
    } );

    this._events.listen( 'event' , 'synchronization:undeployed' , data => {
      this.add( { message: data.value['_1'].name + ' undeployed' , type: 'info' } )
    } );
  }

}
