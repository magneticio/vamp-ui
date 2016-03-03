import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {provide} from 'angular2/core';
import {CrudListComponent} from './crud-list.component';
import {Crud, CrudService} from './crud.service';

class MockCrudService {
  //getAll() { return Promise.resolve([new Crud(1, 'one')]); }
}

describe('CrudListComponent', () => {

  beforeEachProviders(() => [
    provide(CrudService, {useClass: MockCrudService}),
  ]);

  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(CrudListComponent).then((fixture) => {
      fixture.detectChanges();
    });
  }));

});
