const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.fit.vut.cz/study/courses/');

    let table = await page.evaluate((selector) => {
        // This code runs in the browser
        let rows = document.querySelectorAll(selector);
        let data = [];
        rows.forEach((row) => {
            let dataRow = [];
            row.childNodes.forEach((cell) => {
                dataRow.push(cell.textContent);
            });
            data.push(dataRow);
        });
        return data;
    }, '#list tr');
    
    // Format and print the data table
    table.forEach((line) => {
        console.log(line.join(';'));
    });

    await browser.close();
})();
