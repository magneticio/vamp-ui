/// <reference path="../typings/main.d.ts" />

import { VampPage } from './app.po';

describe('vamp App', function() {
  let page: VampPage;

  beforeEach(() => {
    page = new VampPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('vamp Works!');
  });
});
