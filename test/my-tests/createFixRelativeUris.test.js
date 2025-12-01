const { JSDOM } = require('jsdom');
const { expect } = require('chai');

// Import the function from your source file if needed
// For this example, we assume createFixRelativeUris is defined in the same file
function createFixRelativeUris(baseURI, documentURI) {
    return function _fixRelativeUris(articleContent) {
        function toAbsoluteURI(uri) {
            if (baseURI == documentURI && uri.charAt(0) == "#") {
                return uri;
            }
            try {
                return new URL(uri, baseURI).href;
            } catch (ex) {}
            return uri;
        }
        var links = articleContent.querySelectorAll('a');
        links.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href) {
                if (href.indexOf('javascript:') === 0) {
                    if (
                        link.childNodes.length === 1 &&
                        link.childNodes[0].nodeType === link.TEXT_NODE
                    ) {
                        var text = articleContent.ownerDocument.createTextNode(link.textContent);
                        link.parentNode.replaceChild(text, link);
                    } else {
                        var container = articleContent.ownerDocument.createElement('span');
                        while (link.firstChild) {
                            container.appendChild(link.firstChild);
                        }
                        link.parentNode.replaceChild(container, link);
                    }
                } else {
                    link.setAttribute('href', toAbsoluteURI(href));
                }
            }
        });
        var medias = articleContent.querySelectorAll('img, picture, figure, video, audio, source');
        medias.forEach(function (media) {
            var src = media.getAttribute('src');
            var poster = media.getAttribute('poster');
            if (src) {
                media.setAttribute('src', toAbsoluteURI(src));
            }
            if (poster) {
                media.setAttribute('poster', toAbsoluteURI(poster));
            }
        });
    };
}

describe('createFixRelativeUris', () => {
    it('should convert relative href to absolute', () => {
        const dom = new JSDOM('<div><a href="/foo">Foo</a></div>', { url: 'https://example.com/' });
        const baseURI = 'https://example.com/';
        const documentURI = 'https://example.com/page';
        const fixRelativeUris = createFixRelativeUris(baseURI, documentURI);
        const div = dom.window.document.querySelector('div');
        fixRelativeUris(div);
        const link = div.querySelector('a');
        expect(link.getAttribute('href')).to.equal('https://example.com/foo');
    });

    it('should leave hash links unchanged if baseURI matches documentURI', () => {
        const dom = new JSDOM('<div><a href="#section">Section</a></div>', { url: 'https://example.com/' });
        const baseURI = 'https://example.com/page';
        const documentURI = 'https://example.com/page';
        const fixRelativeUris = createFixRelativeUris(baseURI, documentURI);
        const div = dom.window.document.querySelector('div');
        fixRelativeUris(div);
        const link = div.querySelector('a');
        expect(link.getAttribute('href')).to.equal('#section');
    });

    it('should remove javascript: links and preserve text', () => {
        const dom = new JSDOM('<div><a href="javascript:void(0)">Click me</a></div>', { url: 'https://example.com/' });
        const baseURI = 'https://example.com/';
        const documentURI = 'https://example.com/page';
        const fixRelativeUris = createFixRelativeUris(baseURI, documentURI);
        const div = dom.window.document.querySelector('div');
        fixRelativeUris(div);
        expect(div.textContent).to.equal('Click me');
    });

    it('should convert src and poster attributes to absolute', () => {
        const dom = new JSDOM('<div><img src="/img.png"><video poster="/poster.png"></video></div>', { url: 'https://example.com/' });
        const baseURI = 'https://example.com/';
        const documentURI = 'https://example.com/page';
        const fixRelativeUris = createFixRelativeUris(baseURI, documentURI);
        const div = dom.window.document.querySelector('div');
        fixRelativeUris(div);
        const img = div.querySelector('img');
        const video = div.querySelector('video');
        expect(img.getAttribute('src')).to.equal('https://example.com/img.png');
        expect(video.getAttribute('poster')).to.equal('https://example.com/poster.png');
    });
});
