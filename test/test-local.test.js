var chai = require("chai");
// chai.config.includeStack = true;
// var expect = chai.expect;
const expect = require('chai').expect;

var Readability = require("../index").Readability;
var JSDOMParser = require("../JSDOMParser");
var prettyPrint = require("./utils").prettyPrint;



describe('Tesitng local environment', () => {
    it('should run a test in the local environment', () => {
        // This is a placeholder for an actual test
        expect(true).to.equal(true);
    });

    it('should check if the environment is local', () => {
        const isLocal = process.env.NODE_ENV === 'local';
        expect(isLocal).to.equal(false);
    });
}
);
var BASETESTCASE =
    '<html><body><p>Some text and <a class="someclass" href="#">a link</a></p>' +
    '<div id="foo">With a <script>With &lt; fancy " characters in it because' +
    '</script> that is fun.<span>And another node to make it harder</span></div><form><input type="text"/><input type="number"/>Here\'s a form</form></body></html>';

var baseDoc = new JSDOMParser().parse(BASETESTCASE, "http://fakehost/");
describe('Testing Readability with JSDOMParser', () => {
    it('should parse HTML content and extract text', () => {
        const htmlContent = `
            <html>
            <head>
                <title>Test Article</title>
            </head>
                <body>
                   <div
                        class="WaaZC">
                        <div class="RJPOee EIJn2"
                            style="animation: auto ease 0s 1 normal none running none !important;">
                            <div class="rPeykc pyPiTc"
                                data-hveid="CEEQAQ"
                                data-ved="2ahUKEwjk3Jjfi-mNAxX8Z2wGHfSJLjoQo_EKegQIQRAB">
                                <span
                                    data-huuid="18307909948106749193"><span>Benefits
                                        of
                                        using
                                        Mutation
                                        Observer:</span><span>
                                    </span></span>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
        `;

        const DOMParser = new JSDOMParser();
        var baseDoc = new JSDOMParser().parse(htmlContent, "http://fakehost/");
        var parser = new Readability(baseDoc)
        Readability.prototype.REGEXPS['positive'] = /article|data-huuid|body|content|entry|hentry|h-entry|main|page|pagination|post|text|blog|story/i;
        
        var article = parser.parse();
        expect(article.title).to.equal('Test Article');
        expect(article.textContent.trim()).to.include('Benefits');
        expect(article.textContent.trim()).to.include('Mutation Observer:');
    });
} );