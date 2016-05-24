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
  content;

  protected _interval;
  protected _intervalTime = 30000; // 30s

  constructor(
    private _api : ApiService
  ) {
    this.endpoint = this._api._endpoint;
  }

  load() {
    this.content = this._api.getAll( 'info' )
      .subscribe(
        res => this.content = res,
        err => console.error( err )
      );
  }

  initPolling() {
    this._interval = setInterval( () => this.load() , this._intervalTime );
  }

  ngOnInit() {
    this.load();
    this.initPolling();
  }

}
