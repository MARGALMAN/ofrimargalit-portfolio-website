import puppeteer from 'puppeteer';

const b = await puppeteer.launch({headless:'new',args:['--no-sandbox']});
const p = await b.newPage();
await p.setViewport({width:1440,height:900});
await p.goto('http://localhost:3000',{waitUntil:'networkidle2'});
await new Promise(r=>setTimeout(r,1500));
await p.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('vis')));
await new Promise(r=>setTimeout(r,500));

const pmY = await p.evaluate(() => document.getElementById('perfectman').getBoundingClientRect().top + window.scrollY);
console.log('pmY:', pmY);

// Full page, then we'll read the PNG at the right y offset
await p.screenshot({
  path: 'temporary screenshots/screenshot-116-pm-section.png',
  fullPage: true
});
await b.close();
