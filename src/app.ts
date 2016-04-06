import {bootstrap} from 'angular2/platform/browser';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {VampApp} from './app/vamp';
import {ArtifactsStore} from './app/components/artifacts/artifacts-root';
import {newApiService} from './app/services/api/api';
import {newEventStream} from './app/services/event-stream/event-stream';
import {NotificationStore} from './app/services/store/notifications';
import {Store} from './app/services/store/store';

bootstrap(VampApp, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  ArtifactsStore,
  newApiService,
  newEventStream,
  NotificationStore,
  Store
]);
