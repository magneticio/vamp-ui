import {Component} from 'angular2/core';
import {Observable} from 'rxjs/Rx';

import {Notification,NotificationStore} from '../../services/store/notifications';

@Component({
  selector: 'notifier',
  templateUrl: 'app/components/notifier/notifier.html',
  styleUrls: ['app/components/notifier/notifier.css'],
  providers: [],
  directives: [],
  pipes: []
})

export class Notifier {

  public notifications : Observable<Array<Notification>>

  constructor() {}

  // Adds a notification to the notifier which stays live for ~5 seconds
  add() {

  }

}
