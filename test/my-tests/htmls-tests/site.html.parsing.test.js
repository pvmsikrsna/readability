var Readability = require("../../../index").Readability;
var JSDOM = require("jsdom").JSDOM;
const expect = require('chai').expect;
const fs = require('fs');


describe('HTML parsing in Readability', () => {
    // list all html files in the current directory and subdirectories
    let listAllHtmlFiles = function () {
        const fs = require('fs');
        const path = require('path');

        let results = [];

        function readDirRecursive(dir) {
            const files = fs.readdirSync(dir);
            files.forEach((file) => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat && stat.isDirectory()) {
                    readDirRecursive(filePath);
                } else if (file.endsWith('.html')) {
                    results.push(filePath);
                }
            });
        }

        readDirRecursive(path.join(__dirname, 'htmls'));
        return results;
    };

    test('should parse all HTML files without errors', () => {
        const htmlFiles = listAllHtmlFiles();
        htmlFiles.forEach((filePath) => {
            const htmlContent = fs.readFileSync(filePath, 'utf-8');
            const dom = new JSDOM(htmlContent);
            const doc = dom.window.document;
            const reader = new Readability(doc);
            const article = reader.parse();
            const textContent = article ? article.textContent : '';
            expect(article).to.be.an('object');
            expect(article.content).to.be.a('string');
            console.log(`${textContent}`)
            expect(textContent).to.include('Here are the most common ways to');
        });
    });
});