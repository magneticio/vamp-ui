// NG stuff
import {Component,provide} from 'angular2/core';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

// App components
import { CrudListComponent } from './components/crud/crud-list.component';
import { CrudRoot } from './components/crud/crud-root.component';
import { Test } from './components/test/test';
import { Notifier } from './components/notifier/notifier';

import { Artifacts , ArtifactsStore } from './components/artifacts/artifacts-root';

@RouteConfig([
  { path: '/...'  , name: 'Artifacts' , component: Artifacts , useAsDefault: true },
  { path: '/test' , name: 'Test'      , component: Test }
])

@Component({
  selector: 'vamp-app',
  providers: [ ArtifactsStore , HTTP_PROVIDERS ],
  templateUrl: 'app/vamp.html',
  directives: [ Artifacts , Notifier , ROUTER_DIRECTIVES ],
  pipes: []
})

export class VampApp {
  defaultMeaning: number = 42;

  meaningOfLife(meaning?: number) {
    return `The meaning of life is ${meaning || this.defaultMeaning}`;
  }
}
