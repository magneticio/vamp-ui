import { ROUTER_PROVIDERS } from '@angular/router'
import { HTTP_PROVIDERS } from '@angular/http'

import {SHARED_SERVICES} from './shared';

export {environment} from './environment'
export {VampUi} from './vamp-ui.component'

export const VAMP_DEPENDENCIES = [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,

  SHARED_SERVICES
]
