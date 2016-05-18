import { Component, Inject } from '@angular/core';
import { ROUTER_DIRECTIVES, Router, Routes} from '@angular/router';

import { ArtifactsDetailComponent } from './artifacts/artifacts-detail'
import { ArtifactsEditComponent } from './artifacts/artifacts-edit'
import { ArtifactsListComponent } from './artifacts/artifacts-list'
import { VAMP_ARTIFACTS , ArtifactsService } from './artifacts/artifacts.service'

@Component({
  moduleId: module.id,
  selector: 'vamp-ui-app',
  templateUrl: 'vamp-ui.component.html',
  styleUrls: ['vamp-ui.component.css'],

  directives: [ ROUTER_DIRECTIVES ],
  providers : [ VAMP_ARTIFACTS , ArtifactsService ],
})

@Routes([
  { path: '/:resource/add'        , component: ArtifactsEditComponent },
  { path: '/:resource/:name/edit' , component: ArtifactsEditComponent },
  { path: '/:resource/:name'      , component: ArtifactsDetailComponent },
  { path: '/:resource'            , component: ArtifactsListComponent },
  { path: '/'                     , component: ArtifactsListComponent },
])

export class VampUi {
  title = 'vamp-ui works!';

  constructor(
    // @Inject( Router ) Router
  ) {
    // Router.navigate(['/', { resource: 'deployments' }]);
  }
}
