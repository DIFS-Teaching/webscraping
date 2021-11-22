const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 250 // slow down by 250ms
    });
    const page = await browser.newPage();
    await page.goto('https://www.uci.org/road/rankings');
    await page.waitForTimeout(5000);

    // Find the right iframe
    //const frame = page.mainFrame().childFrames().find(frame => frame.title() === 'results');
    const frame = page.mainFrame().childFrames()[0];
    if (!frame) {
        console.log('frame not found!');
        process.exit(1);
    }
    
    // "Individual ranking" link selector
    const rankingLinkSelector = '.leader-part a.ranking-type-link';
    await frame.waitForSelector(rankingLinkSelector);
    //await frame.click(rankingLinkSelector, {delay: 100, clickCount: 10});
    const href = await frame.$eval(rankingLinkSelector, e => e.href);
    await frame.goto(href);
    
    // result table selector
    const tableRowSelector = '#object-rankings > .uci-table-wrapper > table > tbody > tr'; 
    await frame.waitForSelector(tableRowSelector);
    let table = await frame.evaluate((selector) => {
        // This code runs in the browser
        let rows = document.querySelectorAll(selector);
        let data = [];
        rows.forEach((row) => {
            let dataRow = [];
            row.childNodes.forEach((cell) => {
                dataRow.push(cell.textContent.trim());
            });
            data.push(dataRow);
        });
        return data;
    }, tableRowSelector);
    
    // Format and print the data table
    table.forEach((line) => {
        console.log(line.join(';'));
    });

    await browser.close();
})();
