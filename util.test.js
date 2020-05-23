const puppeteer = require('puppeteer');

test('should see dashboard', async () => {
  const browser = await puppeteer.launch({
    headless: false, 
    slowMo: 80, 
    args: ['--window-size=1920, 1080']
  });

  const page = await browser.newPage();
  await page.goto('localhost:3000/login');
  // await page.click('input#login');
  // await page.type('input#login', 'lsliwa');
}, 10000);