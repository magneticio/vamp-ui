import {describe, it, expect, beforeEachProviders, inject} from 'angular2/testing';
import {provide} from 'angular2/core';
import {CrudService} from './crud.service';

describe('CrudService', () => {

  beforeEachProviders(() => [CrudService]);

  it('should get all cruds', inject([CrudService], (crudService:CrudService) => {
    //crudService.getAll().then(cruds => expect(cruds.length).toBe(3));
  }));

  it('should get one crud', inject([CrudService], (crudService:CrudService) => {
    //crudService.get(1).then(crud => expect(crud.id).toBe(1));
  }));

});
