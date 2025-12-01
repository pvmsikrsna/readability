var Readability = require("../../index").Readability;
var JSDOM = require("jsdom").JSDOM;
var isProbablyReaderable = require("../../index").isProbablyReaderable;
const expect = require('chai').expect;

describe('Readability', () => {
    const makeDoc = source => new JSDOM(source).window.document;

    describe('html parsing', () => {
        // simple html div tag retained ?
        it("should retain simple div tag in content", function () {
            var doc = makeDoc('<html><div id="main">This is a simple div tag.</div></html>');
            var reader = new Readability(doc);
            var article = reader.parse();
            expect(article.content).to.include('This is a simple div tag.');
        });

        // simple html span tag retained ?
        it("should retain simple span tag in content", function () {
            var doc = makeDoc('<html><span id="main">This is a simple span tag.</span></html>');
            var reader = new Readability(doc);
            var article = reader.parse();
            expect(article.content).to.include('This is a simple span tag.');
        });

        // simple html p tag retained ?
        it("should retain simple p tag in content", function () {
            var doc = makeDoc('<html><p id="main">This is a simple p tag.</p></html>');
            var reader = new Readability(doc);
            var article = reader.parse();
            expect(article.content).to.include('This is a simple p tag.');
        });

        // no main content but retained
        it("should return null content when no main content", function () {
            var doc = makeDoc('<html><head><title>No content</title></head><body> <p>testing</p></body></html>');
            var reader = new Readability(doc);
            var article = reader.parse();
            expect(article.content).to.include('testing');
        });
    });
});