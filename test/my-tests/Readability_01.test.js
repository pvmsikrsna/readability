var chai = require("chai");
// chai.config.includeStack = true;
// var expect = chai.expect;
const expect = require('chai').expect;

var Readability = require("../../index").Readability;
var JSDOMParser = require("../../JSDOMParser");
const { createParser } = require("./create-fix-realtive-uris");

var BASETESTCASE =
    '<html><body><p>Some text, <a href="/path2">link2</a> and <a class="someclass" href="#">a link</a></p>' +
    '<div id="foo">With a <script>With &lt; fancy " characters in it because' +
    '</script> that is fun.<span>And another node to make it harder</span></div><form><input type="text"/><input type="number"/>Here\'s a form</form></body></html>';



describe('Readability', () => {
    it('should run a test in the local environment', () => {
        // This is a placeholder for an actual test
        expect(true).to.equal(true);
    });

    it('should passing baseURI and documentURI as asrgument', () => {
        var uris = {
            baseURI: "http://fakehost2/",
            href: "http://fakehost2/"
        };
        var parser = createParser(BASETESTCASE, uris.baseURI, uris.href);
        var article = parser.parse();
        expect(article).to.be.an('object');
        let dom = new JSDOMParser().parse(article.content, "text/html");
        dom.getElementsByTagName('a').forEach((link) => {
            expect(link.href).to.include('http://fakehost2/');
        });
    });

    it('should fix relative urls', () => {
        var uris = {
            baseURI: "http://fakehost2/",
            href: "http://fakehost2/post/post1"
        };
        var parser = createParser(BASETESTCASE, uris.baseURI, uris.href);
        var article = parser.parse();
        console.log(article.content);
        let articleDoc = new JSDOMParser().parse(article.content);
        expect(article).to.be.an('object');
    });

    it('REGEXPS.positive is accessible from instance', () => {
        var baseDoc = new JSDOMParser().parse(BASETESTCASE, "http://fakehost/");
        var readability = new Readability(baseDoc, {})

        expect(readability.REGEXPS).to.be.an('object');

        const prototypeSource = Readability.prototype.REGEXPS['positive'].source;
        const unmodified = readability.REGEXPS['positive'].source;

        readability.REGEXPS['positive'] = new RegExp(unmodified.replace('article', `article|data-huuid`), 'i');

        expect(readability.REGEXPS['positive'].source).to.include('data-huuid');

        expect(prototypeSource).to.equal(unmodified, 'Readability prototype REGEXPS should not be modified');

    });
});

