// NG stuff
import {Component,provide} from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

// App components
import { CrudListComponent } from './components/crud/crud-list.component';
import { CrudRoot } from './components/crud/crud-root.component';
import { Test } from './components/test/test';
import { Notifier } from './components/notifier/notifier';

import { ArtifactsAction } from './components/artifacts/artifacts-action';
import { ArtifactsDetail } from './components/artifacts/artifacts-detail';
import { ArtifactsList } from './components/artifacts/artifacts-list';

@RouteConfig([
  { path: '/:resource'             , name: 'ArtifactsList'   , component: ArtifactsList   , useAsDefault: true },
  { path: '/:resource/:id'         , name: 'ArtifactsDetail' , component: ArtifactsDetail },
  { path: '/:resource/:id/:action' , name: 'ArtifactsAction' , component: ArtifactsAction },

  { path: '/test' , name: 'Test' , component: Test },
])

@Component({
  selector: 'vamp-app',
  providers: [ HTTP_PROVIDERS ],
  templateUrl: 'app/vamp.html',
  directives: [ ROUTER_DIRECTIVES , Notifier ],
  pipes: []
})

export class VampApp {
  defaultMeaning: number = 42;

  meaningOfLife(meaning?: number) {
    return `The meaning of life is ${meaning || this.defaultMeaning}`;
  }
}
