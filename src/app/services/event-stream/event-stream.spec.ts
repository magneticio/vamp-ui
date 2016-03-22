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
import {EventStream} from './event-stream';


describe('EventStream Service', () => {

  beforeEachProviders(() => [EventStream]);


  it('should ...', inject([EventStream], (service:EventStream) => {

  }));

});
