import { Component, OnInit } from '@angular/core';

import {Notification,NotificationsService} from '../notifications.service';

@Component({
  moduleId: module.id,
  selector: 'vamp-notifier',
  templateUrl: 'notifier.component.html',
  styleUrls: ['notifier.component.css']
})

export class NotifierComponent implements OnInit {
  constructor(
    private _store : NotificationsService
  ) {}

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
