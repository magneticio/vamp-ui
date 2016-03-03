import {describe, it, expect, beforeEachProviders, inject} from 'angular2/testing';
import {VampApp} from '../app/vamp';

beforeEachProviders(() => [VampApp]);

describe('App: Vamp', () => {
  it('should have the `defaultMeaning` as 42', inject([VampApp], (app: VampApp) => {
    expect(app.defaultMeaning).toBe(42);
  }));

  describe('#meaningOfLife', () => {
    it('should get the meaning of life', inject([VampApp], (app: VampApp) => {
      expect(app.meaningOfLife()).toBe('The meaning of life is 42');
      expect(app.meaningOfLife(22)).toBe('The meaning of life is 22');
    }));
  });
});

