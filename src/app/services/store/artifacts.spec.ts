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
import {ArtifactsStore} from './artifacts';


describe('ArtifactsStore Service', () => {

  beforeEachProviders(() => [ArtifactsStore]);


  it('should ...', inject([ArtifactsStore], (service:ArtifactsStore) => {

  }));

});
