import {bootstrap} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {VampUi, VAMP_DEPENDENCIES, environment} from './app/';

if (environment.production) {
  enableProdMode();
}

bootstrap(VampUi , VAMP_DEPENDENCIES);
