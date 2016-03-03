import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';

import {CrudListComponent} from './crud-list.component';
import {CrudDetailComponent} from './crud-detail.component';
import {CrudService} from './crud.service';

@Component({
  template: '<router-outlet></router-outlet>',
  providers: [CrudService],
  directives: [RouterOutlet]
})
@RouteConfig([
  {path:'/:resource', name: 'CrudList', component: CrudListComponent, useAsDefault: true},
  {path:'/:resource/:name', name: 'CrudDetail', component: CrudDetailComponent}
])
export class CrudRoot {
  constructor() {}
}
