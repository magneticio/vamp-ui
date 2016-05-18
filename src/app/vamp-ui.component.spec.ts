import {
  beforeEachProviders,
  describe,
  expect,
  it,
  inject
} from '@angular/core/testing';
import { VampUi } from '../app/vamp-ui.component';

beforeEachProviders(() => [VampUi]);

describe('App: ReRevampUi', () => {
  it('should create the app',
      inject([VampUi], (app: VampUi) => {
    expect(app).toBeTruthy();
  }));

  it('should have as title \'vamp-ui works!\'',
      inject([VampUi], (app: VampUi) => {
    expect(app.title).toEqual('vamp-ui works!');
  }));
});
