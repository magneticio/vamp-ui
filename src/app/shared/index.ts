import {ApiService} from './api.service'
import {EventsService} from './events.service'
import {NotificationService} from './notifications.service'
import {StoreService} from './store.service'

export const SHARED_SERVICES = [
  ApiService,
  EventsService,
  NotificationService,
  StoreService
];
export * from './notifier';
