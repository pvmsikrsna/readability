// write unites show casing how to use just JSDOM

const { JSDOM } = require('jsdom');
const { expect } = require('chai');


describe('JSDOM  usage example', () => {
    it('should parse HTML and find links', () => {
        const html = '<div><a href="/foo">Foo</a></div>';
        const dom = new JSDOM(html);
        const link = dom.window.document.querySelector('a');
        expect(link.getAttribute('href')).to.equal('/foo');
    });

    // html with head and body, baseURI
    it('should parse full HTML document and find title and body', () => {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test Document</title>
        </head>
        <body>
            <h1>Hello World</h1>
            <p>This is a test document.</p>
        </body>
        </html>
        `;
        const dom = new JSDOM(html);
        const title = dom.window.document.querySelector('title').textContent;
        const h1 = dom.window.document.querySelector('h1').textContent;
        const p = dom.window.document.querySelector('p').textContent;

        expect(title).to.equal('Test Document');
        expect(h1).to.equal('Hello World');
        expect(p).to.equal('This is a test document.');
    });

    // baseURI and document href 
    it('should handle baseURI and document href correctly', () => {
        const html = '<div><a href="/foo">Foo</a></div>';
        const dom = new JSDOM(html, { url: 'https://example.com/' });
        const link = dom.window.document.querySelector('a');
        expect(link.getAttribute('href')).to.equal('/foo');
        expect(link.href).to.equal('https://example.com/foo');

        expect(dom.window.document.baseURI).to.equal('https://example.com/');
        expect(dom.window.document.location.href).to.equal('https://example.com/');
    });

    // jsdom resolve relative urls to full urls using baseURI
    it('should resolve relative URLs to absolute using baseURI', () => {
        const html = '<div><a href="#section">Section</a></div>';
        const dom = new JSDOM(html, { url: 'https://example.com/page' });
        const link = dom.window.document.querySelector('a');
        expect(link.getAttribute('href')).to.equal('#section');
        expect(link.href).to.equal('https://example.com/page#section');
    });
});