export class VampPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('vamp-app p')).getText();
  }
}
