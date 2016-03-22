import {Component} from 'angular2/core';
import {CrudListComponent} from './components/crud/crud-list.component';
import {Test} from './components/test/test';
import {CrudRoot} from './components/crud/crud-root.component';
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
  {path:'/:resource', name: 'CrudList', component: CrudListComponent, useAsDefault: true},
  {path:'/test', name: 'Test', component: Test },
])
export class VampApp {
  defaultMeaning: number = 42;

  meaningOfLife(meaning?: number) {
    return `The meaning of life is ${meaning || this.defaultMeaning}`;
  }
}
