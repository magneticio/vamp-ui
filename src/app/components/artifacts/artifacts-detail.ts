import {Component} from 'angular2/core';

import {Editor} from '../editor/editor';

@Component({
  selector: 'artifacts-detail',
  templateUrl: 'app/components/artifacts/_partials/list.html',
  styleUrls: ['app/components/artifacts/artifacts.css'],
  providers: [ ],
  directives: [ ],
  pipes: []
})
export class ArtifactsDetail {

  constructor(

  ) {
    console.log( this );
    // this.selectedResource = this._routeParams.get('resource') || 'deployments';
    // this.resource = this[ this.selectedResource ];
  }

  ngOnInit() {

  }

}
