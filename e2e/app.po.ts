export class ReRevampUiPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('vamp-ui-app h1')).getText();
  }
}
