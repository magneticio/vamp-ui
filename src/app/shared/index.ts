import {ApiService} from './api.service'
import {EventsService} from './events.service'
import {NotificationsService} from './notifications.service'
import {StoreService} from './store.service'

export const SHARED_SERVICES = [
  ApiService,
  EventsService,
  NotificationsService,
  StoreService
];
export * from './notifier';
