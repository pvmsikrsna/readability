const { JSDOM } = require('jsdom');
const Readability = require('../../index').Readability;
const JSDOMParser = require('../../JSDOMParser');
const Lib = require('./create-fix-realtive-uris');

const htmlCode =
    '<html><body><p>Some text, <a href="/path2">link2</a> and <a class="someclass" href="#">a link</a></p>' +
    '<div id="foo">With a <script>With &lt; fancy " characters in it because' +
    '</script> that is fun.<span>And another node to make it harder</span></div><form><input type="text"/><input type="number"/>Here\'s a form</form></body></html>';

describe('createFixRelativeUris integration', () => {
    it('should convert relative links to absolute and remove javascript: links', () => {
        const baseURI = 'http://fakehost2/';
        const documentURI = 'http://fakehost2/post/post1';
        const parser = Lib.createParser(htmlCode, baseURI, documentURI);
        const article = parser.parse();
        const dom = new JSDOM(article.content);
        dom.window.document.querySelectorAll('a').forEach((link) => {
            const href = link.getAttribute('href');
            expect(href.startsWith('javascript:')).toBe(false);
            expect(href.startsWith('/')).toBe(false);
            if (href === '#') {
                expect(href).toBe('#');
            } else {
                expect(href.startsWith(baseURI)).toBe(true);
            }
        });
    });

    it('should not modify hash links when baseURI matches documentURI', () => {
        const baseURI = 'http://fakehost2/post/post1';
        const documentURI = 'http://fakehost2/post/post1';
        const parser = Lib.createParser(htmlCode, baseURI, documentURI);
        const article = parser.parse();
        const dom = new JSDOM(article.content);
        dom.window.document.querySelectorAll('a').forEach((link) => {
            const href = link.getAttribute('href');
            if (href === '#') {
                expect(href).toBe('#');
            }
        });
    });

    it('should convert src and poster attributes to absolute', () => {
        const testCase = '<div>Title<img src="/img.png"><video poster="/poster.png"></video></div>';
        const baseURI = 'https://example.com/';
        const documentURI = 'https://example.com/page';
        const parser = Lib.createParser(testCase, baseURI, documentURI);
        const article = parser.parse();
        const dom = new JSDOM(article.content);
        const img = dom.window.document.querySelector('img');
        const video = dom.window.document.querySelector('video');
        expect(img.getAttribute('src')).toBe('https://example.com/img.png');
        expect(video.getAttribute('poster')).toBe('https://example.com/poster.png');
    });
});
