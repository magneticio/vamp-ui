import {describe, it, expect, beforeEachProviders, inject} from 'angular2/testing';
import {provide} from 'angular2/core';
import {TestService} from './test.service';

describe('TestService', () => {

  beforeEachProviders(() => [TestService]);

  it('should get all tests', inject([TestService], (testService:TestService) => {
    testService.getAll().then(tests => expect(tests.length).toBe(3));
  }));

  it('should get one test', inject([TestService], (testService:TestService) => {
    testService.get(1).then(test => expect(test.id).toBe(1));
  }));

});
