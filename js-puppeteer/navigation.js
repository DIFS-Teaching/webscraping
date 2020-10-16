const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: true
        //slowMo: 250 // slow down by 250ms
    });
    const page = await browser.newPage();
    await page.goto('https://www.uci.org/road/rankings');
    await page.waitForTimeout(5000);

    // Find the right iframe
    const frame = page.mainFrame().childFrames().find(frame => frame.name() === 'live-iframe');
    if (!frame) {
        console.log('frame not found!');
        process.exit(1);
    }
    
    // "Individual ranking" link selector
    const rankingLinkSelector = '.leader-part .ranking-type-link';
    await frame.waitForSelector(rankingLinkSelector);
    await frame.click(rankingLinkSelector);
    
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
