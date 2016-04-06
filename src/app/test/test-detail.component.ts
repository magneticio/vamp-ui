import {Component, OnInit} from 'angular2/core';
import {Test, TestService} from './test.service';
import {RouteParams, Router} from 'angular2/router';
import {CanDeactivate, ComponentInstruction} from 'angular2/router';

@Component({
  templateUrl: 'app/test/test-detail.component.html',
  styleUrls: ['app/test/test-detail.component.css']
})
export class TestDetailComponent implements OnInit, CanDeactivate {

  test: Test;
  editName: string;

  constructor(
    private _service: TestService,
    private _router: Router,
    private _routeParams: RouteParams
    ) { }

  ngOnInit() {
    let id = +this._routeParams.get('id');
    this._service.get(id).then(test => {
      if (test) {
        this.editName = test.name;
        this.test = test;
      } else {
        this.gotoList();
      }
    });
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    if (!this.test || this.test.name === this.editName) {
      return true;
    }

    return new Promise<boolean>((resolve, reject) => resolve(window.confirm('Discard changes?')));
  }

  cancel() {
    this.editName = this.test.name;
    this.gotoList();
  }

  save() {
    this.test.name = this.editName;
    this.gotoList();
  }

  gotoList() {
    this._router.navigate(['TestList']);
  }
}
