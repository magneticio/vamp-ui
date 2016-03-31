import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {VampApp} from './app/vamp';
import {newApiService} from './app/services/api/api';
import {Store} from './app/services/store/store';

bootstrap(VampApp, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  newApiService,
  Store
]);