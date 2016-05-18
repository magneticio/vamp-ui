import { ReRevampUiPage } from './app.po';

describe('vamp-ui App', function() {
  let page: ReRevampUiPage;

  beforeEach(() => {
    page = new ReRevampUiPage();
  })

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('vamp-ui works!');
  });
});
