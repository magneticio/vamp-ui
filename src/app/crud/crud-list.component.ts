import {Component, OnInit} from 'angular2/core';
import {CrudService} from './crud.service';
import {RouteParams, Router} from 'angular2/router';
import {RouterOutlet, ROUTER_DIRECTIVES} from 'angular2/router';
import {Pipe, PipeTransform} from 'angular2/core';

/*
Pipe keys and values for an Array
*/
@Pipe({name: 'keyValues'})
export class KeyValuesPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }
    return keys;
  }
}

@Component({
  templateUrl: 'app/crud/crud-list.component.html',
  styleUrls: ['app/crud/crud-list.component.css'],
  directives: [RouterOutlet, ROUTER_DIRECTIVES],
  pipes: [KeyValuesPipe],
  providers: [CrudService],
})
export class CrudListComponent implements OnInit {

  public _items = [];
  selectedItem: Object;
  public resource:string = '';

  constructor(
    private _routeParams: RouteParams,
    private _service: CrudService
  ) {}

  ngOnInit() {
    this.resource = this._routeParams.get('resource') || 'deployments';
    this._service.items$.subscribe(updatedItems => this._items = updatedItems);
    this._service.getAll(this.resource);
  }

  onSelect(item: Object) { console.log('Selected', item); this.selectedItem = item; }

}
