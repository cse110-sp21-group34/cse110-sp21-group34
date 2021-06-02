const { Keyboard } = require("puppeteer");

describe('Basic user flow for SPA ', () => {
    beforeAll(async () => {
      await page.goto('http://localhost:8000');
      await page.waitForTimeout(500);
    });

    it('Test1', async () => {
      const numMonths = await page.$$("option[class='oneMonth']");
      expect(numMonths.length).toBe(12);
    });

    it('Test2', async () => {
      const input = await page.$("div[id='editor']");
      await input.click();

      await page.keyboard.press('m');
      await page.keyboard.press('e');
      await page.keyboard.press('s');
      await page.keyboard.press('s');
      await page.keyboard.press('a');
      await page.keyboard.press('g');
      await page.keyboard.press('e');
      
      /*const localStorageData = await page.evaluate(() => {
        let json = {};
        for (let i = 0; i < localStorage.length; i++) {
          console.log(localStorage.length);
          const key = localStorage.key(i);
          json[key] = localStorage.getItem(key);
        }
        return json;
      });*/
      const localStorageData = await page.evaluate(() =>  Object.assign({}, window.localStorage));

      console.log(localStorageData);
      expect(localStorageData).toBe("message");
    }, 15000);

})