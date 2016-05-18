import { ROUTER_PROVIDERS } from '@angular/router'
import { HTTP_PROVIDERS } from '@angular/http'

import {ApiService} from './api.service'
import {EventsService} from './events.service'
import {NotificationService} from './notifications.service'
import {StoreService} from './store.service'

export {environment} from './environment'
export {VampUi} from './vamp-ui.component'

export const VAMP_DEPENDENCIES = [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,

  ApiService,
  EventsService,
  NotificationService,
  StoreService
]
