// JSDOMParser examples tests
const { expect } = require('chai');
const JSDOMParser = require('../../JSDOMParser');

describe('JSDOMParser usage example', () => {
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
});