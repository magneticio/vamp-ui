import {Component} from 'angular2/core';
import {CrudListComponent} from './crud/crud-list.component';
import {CrudRoot} from './crud/crud-root.component';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  selector: 'vamp-app',
  providers: [HTTP_PROVIDERS],
  templateUrl: 'app/vamp.html',
  directives: [ROUTER_DIRECTIVES],
  pipes: []
})
@RouteConfig([
  {path:'/:resource', name: 'CrudList', component: CrudListComponent, useAsDefault: true}
])
export class VampApp {
  defaultMeaning: number = 42;

  meaningOfLife(meaning?: number) {
    return `The meaning of life is ${meaning || this.defaultMeaning}`;
  }
}
