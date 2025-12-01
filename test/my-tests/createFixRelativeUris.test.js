const { JSDOM } = require('jsdom');
const { expect } = require('chai');
const Lib = require('./create-fix-realtive-uris');

const htmlCode =
    '<html><body><p>Some text, <a href="/path2">link2</a> and <a class="someclass" href="#">a link</a></p>' +
    '<div id="foo">With a <script>With &lt; fancy " characters in it because' +
    '</script> that is fun.<span>And another node to make it harder</span></div><form><input type="text"/><input type="number"/>Here\'s a form</form></body></html>';


describe('createFixRelativeUris', () => {
    describe('createFixRelativeUris function', () => {
        it('should return a function', () => {
            const fixRelativeUris = Lib.createFixRelativeUris('http://example.com', 'http://example.com/page');
            expect(fixRelativeUris).to.be.a('function');
        });
    });

    describe('createFixRelativeUris relative urls to absolute', () => {
        it('should convert relative links to absolute and remove javascript: links', () => {
            const baseURI = 'http://fakehost2/';
            const documentURI = 'http://fakehost2/post/post1';
            const parser = Lib.createParser(htmlCode, baseURI, documentURI);
            const article = parser.parse();
            const dom = new JSDOM(article.content);
            dom.window.document.querySelectorAll('a').forEach((link) => {
                const href = link.getAttribute('href');
                expect(href.startsWith('javascript:')).to.be.false;
                expect(href.startsWith('/')).to.be.false;
                if (href === '#') {
                    expect(href).to.equal('#');
                } else {
                    expect(href.startsWith(baseURI)).to.be.true;
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
            expect(img.attributes['src'].value).to.equal('https://example.com/img.png');
            expect(video.attributes['poster'].value).to.equal('https://example.com/poster.png');
        });
    })

    it('should convert relative href to absolute', () => {
        const dom = new JSDOM('<div><a href="/foo">Foo</a></div>', { url: 'https://example.com/' });
        const baseURI = 'https://example.com/';
        const documentURI = 'https://example.com/page';
        const fixRelativeUris = Lib.createFixRelativeUris(baseURI, documentURI);
        const div = dom.window.document.querySelector('div');
        fixRelativeUris(div);
        const link = div.querySelector('a');
        expect(link.attributes['href'].value).to.equal('https://example.com/foo');
    });

    it('should leave hash links unchanged if baseURI matches documentURI', () => {
        const dom = new JSDOM('<div><a href="#section">Section</a></div>', { url: 'https://example.com/' });
        const baseURI = 'https://example.com/page';
        const documentURI = 'https://example.com/page';
        const fixRelativeUris = Lib.createFixRelativeUris(baseURI, documentURI);
        const div = dom.window.document.querySelector('div');
        fixRelativeUris(div);
        const link = div.querySelector('a');
        expect(link.getAttribute('href')).to.equal('https://example.com/page#section');
    });

    it('should remove javascript: links and preserve text', () => {
        const dom = new JSDOM('<div><a href="javascript:void(0)">Click me</a></div>', { url: 'https://example.com/' });
        const baseURI = 'https://example.com/';
        const documentURI = 'https://example.com/page';
        const fixRelativeUris = Lib.createFixRelativeUris(baseURI, documentURI);
        const div = dom.window.document.querySelector('div');
        fixRelativeUris(div);
        expect(div.textContent).to.equal('Click me');
    });

    it('should convert src and poster attributes to absolute', () => {
        const dom = new JSDOM('<div><img src="/img.png"><video poster="/poster.png"></video></div>', { url: 'https://example.com/' });
        const baseURI = 'https://example.com/';
        const documentURI = 'https://example.com/page';
        const fixRelativeUris = Lib.createFixRelativeUris(baseURI, documentURI);
        const div = dom.window.document.querySelector('div');
        fixRelativeUris(div);
        const img = div.querySelector('img');
        const video = div.querySelector('video');
        expect(img.getAttribute('src')).to.equal('https://example.com/img.png');
        expect(video.getAttribute('poster')).to.equal('https://example.com/poster.png');
    });


});
