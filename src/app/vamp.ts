import {Component} from 'angular2/core';
import {CrudListComponent} from './components/crud/crud-list.component';
import {Test} from './components/test/test';
import {CrudRoot} from './components/crud/crud-root.component';
import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';


// Vamp
import { Blueprints } from './components/artifacts/blueprints/blueprints';
import { Breeds } from './components/artifacts/breeds/breeds';
import { Deployments } from './components/artifacts/deployments/deployments';
import { Escalations } from './components/artifacts/escalations/escalations';
import { Filters } from './components/artifacts/filters/filters';
import { Gateways } from './components/artifacts/gateways/gateways';
import { Scales } from './components/artifacts/scales/scales';
import { Slas } from './components/artifacts/slas/slas';
import { Workflows } from './components/artifacts/workflows/workflows';

const VAMP_ARTIFACTS = [
  Blueprints,
  Deployments,
];

@Component({
  selector: 'vamp-app',
  providers: [HTTP_PROVIDERS],
  templateUrl: 'app/vamp.html',
  directives: [ROUTER_DIRECTIVES , VAMP_ARTIFACTS],
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
