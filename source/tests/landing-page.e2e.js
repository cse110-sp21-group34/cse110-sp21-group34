const { Keyboard } = require("puppeteer");

describe('Basic user flow for SPA ', () => {
    beforeAll(async () => {
      await page.goto('http://localhost:8000');
    }, 30000);

    it('Correct number of months', async () => {
      const numMonths = await page.$$("option[class='oneMonth']");
      expect(numMonths.length).toBe(12);
    });

    it('Text input', async () => {
      const input = await page.$("div[id='editor']");
      await input.click();

      await page.waitForTimeout(1000); // Wait for element to come up

      await page.keyboard.type('message');

      const content = await page.evaluate(() => {
        return document.getElementsByClassName('cdx-nested-list__item-content')[0].textContent;
      })
      expect(content).toBe('message');
      /*const localStorageData = await page.evaluate(() => {
        let json = {};
        for (let i = 0; i < localStorage.length; i++) {
          console.log(localStorage.length);
          const key = localStorage.key(i);
          json[key] = localStorage.getItem(key);
        }
        return json;
      });*/
      // const localStorageData = await page.evaluate(() =>  Object.assign({}, window.localStorage));

      // console.log(localStorageData);
      // expect(localStorageData).toBe("message");
    }, 15000);

})