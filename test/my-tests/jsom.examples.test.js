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
});