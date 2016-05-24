import { Component, OnInit } from '@angular/core';

import {ApiService} from '../shared/api.service';

@Component({
  moduleId: module.id,
  selector: 'vamp-info',
  templateUrl: 'info.component.html',
  styleUrls: ['info.component.css']
})
export class InfoComponent implements OnInit {

  endpoint;
  info;

  constructor(
    private _api : ApiService
  ) {
    this.endpoint = this._api._endpoint;
  }

  ngOnInit() {
    this.info = this._api.getAll( 'info' )
      .subscribe(
        res => this.info = res,
        err => console.error( err )
      );
  }

}
