import { Component , Inject , Injectable } from 'angular2/core'
import { RouteConfig , RouterOutlet } from 'angular2/router'

import { ArtifactsDetail } from './artifacts-detail'
import { ArtifactsList } from './artifacts-list'

@Component({
  directives: [ RouterOutlet ],
  providers : [ ],
  selector  : 'vamp-artifacts',
  // templateUrl : './app/components/artifacts/artifacts.html'
  template  : '<router-outlet></router-outlet>'
})

@RouteConfig([
  { path: '/...' , redirectTo: ['ArtifactsList' , { resource: 'deployments' }] , useAsDefault: true },
  { path: '/:resource'             , name: 'ArtifactsList'         , component: ArtifactsList   },
  { path: '/:resource/:id'         , name: 'ArtifactsDetail'       , component: ArtifactsDetail },
  { path: '/:resource/:id/:action' , name: 'ArtifactsDetailAction' , component: ArtifactsDetail },
])

export class Artifacts {
  constructor() {}
}
