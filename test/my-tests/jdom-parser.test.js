const JSDOMParser = require('../../JSDOMParser');

describe('JSDOMParser', () => {
  test('should parse HTML and find links', () => {
    const html = '<div><a href="/foo">Foo</a></div>';
    const doc = new JSDOMParser().parse(html);
    // no querySelector in JSDOMParser, so we use getElementsByTagName
    const link = doc.getElementsByTagName('a')[0];
    expect(link.getAttribute('href')).toBe('/foo');
  });
});