const cheerio = require('cheerio');
const request = require('request');

request({
    method: 'GET',
    url: 'https://www.fit.vut.cz/study/courses/'
}, (err, res, body) => {
    let $ = cheerio.load(body);

    let rows = $('#list tr');
    rows.each(function(i, tr) {
        let line = '';
        $(this).children().each(function(j, td) {
            line += $(this).text() + ';';
        })
        console.log(line);
    });
});
