import {Component, OnInit} from 'angular2/core';
import {CrudService} from './crud.service';
import {RouteParams, Router} from 'angular2/router';
import {CanDeactivate, ComponentInstruction} from 'angular2/router';

@Component({
  templateUrl: 'app/crud/crud-detail.component.html',
  styleUrls: ['app/crud/crud-detail.component.css']
})
export class CrudDetailComponent implements OnInit, CanDeactivate {

  public _item = [];
  public resource:string = '';

  editName: string;

  constructor(
    private _service: CrudService,
    private _router: Router,
    private _routeParams: RouteParams
    ) { }

  ngOnInit() {
    let name:string = this._routeParams.get('name');
    this.resource = this._routeParams.get('resource');
    this._service.get(this.resource, name);
  }

  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction): any {
    //if (!this.crud || this.crud.name === this.editName) {
    //  return true;
    //}

    return new Promise<boolean>((resolve, reject) => resolve(window.confirm('Discard changes?')));
  }

  cancel() {
    //this.editName = this.crud.name;
    this.gotoList();
  }

  save() {
    //this.crud.name = this.editName;
    this.gotoList();
  }

  gotoList() {
    this._router.navigate(['CrudList']);
  }
}
