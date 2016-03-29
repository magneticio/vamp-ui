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
  Breeds,
  Deployments,
  Escalations,
  Filters,
  Gateways,
  Scales,
  Slas,
  Workflows
];

@RouteConfig([
  // { path: '/:resource' , name: 'CrudList' , component: CrudListComponent , useAsDefault: true },

  // TODO: Abstract all the artifacts which share capabilities into a generic
  // component instead of each having their own logic.
  { path: '/blueprints'  , name: 'Blueprints'  , component: Blueprints },
  { path: '/breeds'      , name: 'Breeds'      , component: Breeds },
  { path: '/deployments' , name: 'Deployments' , component: Deployments , useAsDefault: true },
  { path: '/escalations' , name: 'Escalations' , component: Escalations },
  { path: '/filters'     , name: 'Filters'     , component: Filters },
  { path: '/gateways'    , name: 'Gateways'    , component: Gateways },
  { path: '/scales'      , name: 'Scales'      , component: Scales },
  { path: '/slas'        , name: 'Slas'        , component: Slas },
  { path: '/workflows'   , name: 'Workflows'   , component: Workflows },

  { path: '/test'      , name: 'Test'     , component: Test },
])

@Component({
  selector: 'vamp-app',
  providers: [HTTP_PROVIDERS],
  templateUrl: 'app/vamp.html',
  directives: [ROUTER_DIRECTIVES , VAMP_ARTIFACTS],
  pipes: []
})

export class VampApp {
  defaultMeaning: number = 42;

  meaningOfLife(meaning?: number) {
    return `The meaning of life is ${meaning || this.defaultMeaning}`;
  }
}
