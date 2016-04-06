import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';

import {TestListComponent} from './test-list.component';
import {TestDetailComponent} from './test-detail.component';
import {TestService} from './test.service';

@Component({
  template: '<router-outlet></router-outlet>',
  providers: [TestService],
  directives: [RouterOutlet]
})
@RouteConfig([
  {path:'/', name: 'TestList', component: TestListComponent, useAsDefault: true},
  {path:'/:id', name: 'TestDetail', component: TestDetailComponent}
])
export class TestRoot {
  constructor() {}
}
