export class VampPage {
  navigateTo() { return browser.get('/'); }
  getParagraphText() { return element(by.css('Vamp-app p')).getText(); }
}
