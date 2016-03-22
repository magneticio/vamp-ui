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
import {CrudDetailComponent} from './crud-detail.component';
import {Router, RouteParams} from 'angular2/router';
import {ApiService} from '../../services/api/api';

class MockCrudService {
  //get() { return Promise.resolve(new Crud('one')); }
}

class MockRouter {
  navigate() { }
}

class MockRouteParams {
  get() { return 1; }
}

describe('CrudDetailComponent', () => {

  beforeEachProviders(() => [
    //provide(ApiService, {useClass: MockCrudService}),
    provide(Router, {useClass: MockRouter}),
    provide(RouteParams, {useClass: MockRouteParams}),
  ]);

  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(CrudDetailComponent).then((fixture) => {
      fixture.detectChanges();
    });
  }));

});
