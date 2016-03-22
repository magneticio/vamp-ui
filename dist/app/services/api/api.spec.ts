import {describe, it, expect, beforeEachProviders, inject} from 'angular2/testing';
import {provide} from 'angular2/core';
import {ApiService} from './api';

describe('ApiService', () => {

  beforeEachProviders(() => [ApiService]);

  it('should get all apis', inject([ApiService], (apiService:ApiService) => {
    //apiService.getAll().then(apis => expect(apis.length).toBe(3));
  }));

  it('should get one apis', inject([ApiService], (apiService:ApiService) => {
    //apiService.get(1).then(api => expect(api.id).toBe(1));
  }));

});
