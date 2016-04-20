import { Component , Inject , Injectable } from 'angular2/core'
import { RouteConfig , RouterOutlet } from 'angular2/router'

import { ArtifactsCreator } from './artifacts-creator'
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
  { path: '/:resource'     , name: 'ArtifactsList'    , component: ArtifactsList   },
  { path: '/:resource/add' , name: 'ArtifactsCreator' , component: ArtifactsCreator },
  { path: '/:resource/:id' , name: 'ArtifactsDetail'  , component: ArtifactsDetail },
])

export class Artifacts {
  constructor() {}
}
