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
import {TestDetailComponent} from './test-detail.component';
import {Router, RouteParams} from 'angular2/router';
import {Test, TestService} from './test.service';

class MockTestService {
  get() { return Promise.resolve(new Test(1, 'one')); }
}

class MockRouter {
  navigate() { }
}

class MockRouteParams {
  get() { return 1; }
}

describe('TestDetailComponent', () => {

  beforeEachProviders(() => [
    provide(TestService, {useClass: MockTestService}),
    provide(Router, {useClass: MockRouter}),
    provide(RouteParams, {useClass: MockRouteParams}),
  ]);

  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(TestDetailComponent).then((fixture) => {
      fixture.detectChanges();
    });
  }));

});
