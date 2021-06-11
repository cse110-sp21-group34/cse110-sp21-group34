const { Keyboard } = require("puppeteer");

describe('Basic user flow for SPA ', () => {
    beforeAll(async () => {
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
      await page.goto('http://localhost:8000');
    }, 30000);

    it('Correct number of months', async () => {
      const numMonths = await page.$$("option[class='oneMonth']");
      expect(numMonths.length).toBe(12);
    });

    it('First entry correct title', async () => {
      var title = '';
      var date = new Date();
      title = title + (date.getMonth() + 1) + '/';
      title = title + date.getDate() + ', ';

      const content = await page.evaluate(() => {
        return document.getElementsByClassName('dailyDate')[0].textContent;
      })

      var day = date.getDay();
      if(day == 1) title = title + 'Monday';
      else if(day == 2) title = title + 'Tuesday';
      else if(day == 3) title = title + 'Wednesday';
      else if(day == 4) title = title + 'Thursday';
      else if(day == 5) title = title + 'Friday';
      else if(day == 6) title = title + 'Saturday';
      else if(day == 7) title = title + 'Sunday';

      expect(content).toBe(title);
    });

    it('Text input', async () => {
      const input = await page.$("div[id='editor']");
      await input.click();

      await page.waitForTimeout(1000); // Wait for element to come up

      await page.keyboard.type('message');

      await page.keyboard.press('Enter');
      const content = await page.evaluate(() => {
        return document.getElementsByClassName('cdx-nested-list__item-content')[0].textContent;
      })

      expect(content).toBe('message');
    }, 15000);

    it('Add image', async () => {
      const input = await page.$("div[id='editor']");
      const clipboardy = require('clipboardy');
      await input.click();
      await page.waitForTimeout(1000); // Wait for element to come up
      const text = 'https://img95.699pic.com/photo/40011/0709.jpg_wh860.jpg';
      await clipboardy.writeSync(text);
      await page.waitFor(500);
      await page.keyboard.down('Control');
      await page.keyboard.down('Shift');
      await page.keyboard.press('KeyV');
      await page.keyboard.up('Control');
      await page.keyboard.up('Shift');
      //await page.keyboard.type('https://img95.699pic.com/photo/40011/0709.jpg_wh860.jpg');
      await page.waitFor(500);
      const src = await page.evaluate(() => {
        // return document.getElementsByClassName("cdx-block cdx-simple-image")[0].getElementsByTagName('img').src;
        return document.querySelector("div > img").getAttribute('src');
      })
      expect(src).toBe('https://img95.699pic.com/photo/40011/0709.jpg_wh860.jpg');
    }, 10000);




    it('Switching dates and preserve content', async () => {
      var curr = await page.evaluate(() => {
        return document.getElementsByClassName('oneDay oneDayActive')[0].getAttribute('id');
      })
      var next = Number(curr.substring(1)) + 10000;
      next = curr.substring(0, 1) + next;
      var pattern = "div[id='" + next + "']";
      var nextDt = await page.$(pattern);
      await nextDt.click();
      await page.waitForTimeout(1000);

      pattern = "div[id='" + curr + "']";
      var nextDt = await page.$(pattern);
      await nextDt.click();
      await page.waitForTimeout(1000);

      const content = await page.evaluate(() => {
        return document.getElementsByClassName('cdx-nested-list__item-content')[0].textContent;
      })

      expect(content).toBe('message');
    }, 15000);

    it('Switching year', async () => {

      const panel = await page.$("div[id='selectorExpBlock']");
      await panel.click();

      const year = await page.$("i[class='bi bi-arrow-right-short']");
      await year.click();

      const select = await page.$("select[id='monthSelector']");
      await select.click();

      await page.select('#monthSelector', '1');

      var testYear = await page.evaluate(() => {
        return document.getElementById('yearNum').innerHTML;
      })
      testYear = Number(testYear);
      var thisMonth = 2;
      var numDays = new Date(testYear, thisMonth, 0).getDate();
      console.log(numDays);

      const days = await page.evaluate(() => {
        return document.getElementsByClassName('oneDay').length;
      })

      expect(days).toBe(numDays);
    }, 15000);


       // Testing language for Indonesia
    it('Switch language to Chinese', async () => {
      const settingIcon = await page.$("i[id='settingIcon']");
      await settingIcon.click();

      const select = await page.$("select[id='languageSelector']");
      await select.click();
      await page.select('#languageSelector', 'Bahasa Indonesia');
      var title = '';
      var date = new Date();
      title = title + (date.getMonth() + 1) + '/';
      title = title + date.getDate() + ', ';

      const content = await page.evaluate(() => {
        return document.getElementsByClassName('dailyDate')[0].textContent;
      })

      var day = date.getDay();
      if(day == 1) title = title + 'Rabu';
      else if(day == 2) title = title + 'Kamis';
      else if(day == 3) title = title + 'Jumat';
      else if(day == 4) title = title + 'Sabtu';
      else if(day == 5) title = title + 'Minggu';
      else if(day == 6) title = title + 'Senin';
      else if(day == 7) title = title + 'Selasa';
      await settingIcon.click();
      expect(content).toBe(title);
    });
})
