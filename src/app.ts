import {bootstrap} from 'angular2/platform/browser';
import {VampApp} from './app/vamp';
import {ROUTER_PROVIDERS} from 'angular2/router';

bootstrap(VampApp, [
  ROUTER_PROVIDERS
]);
