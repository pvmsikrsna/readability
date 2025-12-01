// JSDOMParser examples tests
const { expect } = require('chai');
const JSDOMParser = require('../../JSDOMParser');

describe('JSDOMParser LightWeight Parser for WebWorkers', () => {
    test('should parse HTML and find links', () => {
        const html = '<div><a href="/foo">Foo</a></div>';
        const doc = new JSDOMParser().parse(html);
        const link = doc.getElementsByTagName('a')[0];
        expect(link.getAttribute('href')).to.equal('/foo');
        expect(link.href).to.equal('/foo');
        // expect querySelector is not supported
        expect(() => doc.querySelector('a')).to.throw();
        expect(() => doc.querySelectorAll('a')).to.throw();
    });

    // test sample html code with head and body
    test('should parse full HTML document and find title and body', () => {
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
        const doc = new JSDOMParser().parse(html);
        const title = doc.getElementsByTagName('title')[0].textContent;
        const h1 = doc.getElementsByTagName('h1')[0].textContent;
        const p = doc.getElementsByTagName('p')[0].textContent;

        expect(title).to.equal('Test Document');
        expect(h1).to.equal('Hello World');
        expect(p).to.equal('This is a test document.');
    });

    // test baseURI and document href 
    test('should handle baseURI and document href correctly', () => {
        const html = '<div><a href="/foo">Foo</a></div>';
        const baseURI = 'https://example.com/';
        const doc = new JSDOMParser(baseURI).parse(html);
        const link = doc.getElementsByTagName('a')[0];
        expect(link.getAttribute('href')).to.equal('/foo');
        expect(link.href).to.equal('/foo');

        // no doc.baseURI and no doc.location
        expect(doc.baseURI).to.be.undefined;
        expect(doc.location).to.be.undefined;
    });
});