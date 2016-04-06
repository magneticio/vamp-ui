import {Component, OnInit} from 'angular2/core';
import {Test, TestService} from './test.service';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
  templateUrl: 'app/test/test-list.component.html',
  styleUrls: ['app/test/test-list.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class TestListComponent implements OnInit {
  tests: Test[];
  constructor(
    private _service: TestService) {}
  ngOnInit() {
    this._service.getAll().then(tests => this.tests = tests);
  }
}
