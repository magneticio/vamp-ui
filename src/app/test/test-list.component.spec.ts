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
import {TestListComponent} from './test-list.component';
import {Test, TestService} from './test.service';

class MockTestService {
  getAll() { return Promise.resolve([new Test(1, 'one')]); }
}

describe('TestListComponent', () => {

  beforeEachProviders(() => [
    provide(TestService, {useClass: MockTestService}),
  ]);

  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(TestListComponent).then((fixture) => {
      fixture.detectChanges();
    });
  }));

});
