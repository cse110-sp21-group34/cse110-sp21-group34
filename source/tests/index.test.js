const puppeteer = require("puppeteer");

describe("Test the test_button", () => {
  let page;
  let browser;
  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("http://127.0.0.1:5000/test-index.html");
    console.log("Hey Console!");
  }, 5000);

  it("No button is clicked yet...", async () => {
    const result = await page.evaluate(() =>
      document.getElementById("test_content")
    );
    console.log(await result);
    await expect(result).toBeNull();
  });

  it("Did I just click the button?", async () => {
    await page.evaluate(("#test_button") => document.querySelector("#test_button").click(), "#test_button");
    await page.click("#test_button");
    const result = await page.evaluate(
      () => document.getElementById("test_content").textContent
    );
    console.log(await result);
    await expect.anything(result);
  });

  afterAll(async () => {
    browser.close();
  }, 5000);
});
