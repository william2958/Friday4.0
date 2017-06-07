import { FridayPage } from './app.po';

describe('friday App', () => {
  let page: FridayPage;

  beforeEach(() => {
    page = new FridayPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
