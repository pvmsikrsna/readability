const { JSDOM } = require('jsdom');
const Readability = require('../../index').Readability;
const JSDOMParser = require('../../JSDOMParser');


// createFixRelativeUris(baseURI, documentURI) returns a function that mimics the real _fixRelativeUris, but uses the provided baseURI and documentURI instead of reading them from this._doc.
// 
// This allows you to control the base URI logic ensuring that relative URLs are resolved as expected, regardless of the actual document's base URI.


/**
 * returns a function that mimics the real _fixRelativeUris, but uses the provided baseURI and documentURI instead of reading them from this._doc within Readability.
 

 * This allows you to control the base URI logic ensuring that relative URLs are resolved as expected, regardless of the actual document's base URI.
 * @example
var uris = {
    baseURI: "http://fakehost2/",
    href: "http://fakehost2/post/post1"
};
var parser = new Readability(baseDoc, {})
parser._fixRelativeUris = createFixRelativeUris(uris.baseURI, uris.href);
var article = parser.parse(); 
 * @param {*} baseURI 
 * @param {*} documentURI 
 * @returns 
 */
function createFixRelativeUris(baseURI, documentURI) {
    return function _fixRelativeUris(articleContent) {
        function toAbsoluteURI(uri) {
            if (uri.charAt(0) == "#") {
                let res = new URL(uri, documentURI).href;
                return res;
            }
            try {
                let res = new URL(uri, baseURI).href;
                return res;
            } catch (ex) { }
            return uri;
        }
        if (!articleContent) {
            console.warn("articleContent is invalid in _fixRelativeUris", { this: this, articleContent });
            return;
        }
        // if no querySelectorAll, use getElementsByTagName or similar  

        var links = [];
        if (articleContent.querySelectorAll) {
            links = articleContent.querySelectorAll('a');
        } else if (articleContent.getElementsByTagName) {
            links = articleContent.getElementsByTagName('a');
        } else {
            console.warn("articleContent has no querySelectorAll or getElementsByTagName", { articleContent });
            return;
        }
        Array.from(links).forEach(function (link) {
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

        var medias = [];
        if (articleContent.querySelectorAll) {
            medias = articleContent.querySelectorAll('img, picture, figure, video, audio, source');
            medias = Array.prototype.concat.apply([], medias);
        } else if (articleContent.getElementsByTagName) {
            medias.push(...Array.from(articleContent.getElementsByTagName('picture')));
            medias.push(...Array.from(articleContent.getElementsByTagName('img')));
            medias.push(...Array.from(articleContent.getElementsByTagName('figure')));
            medias.push(...Array.from(articleContent.getElementsByTagName('video')));
            medias.push(...Array.from(articleContent.getElementsByTagName('audio')));
            medias.push(...Array.from(articleContent.getElementsByTagName('source')));
            medias = Array.prototype.concat.apply([], medias);
        } else {
            console.warn("articleContent has no querySelectorAll or getElementsByTagName", { articleContent });
            return;
        }
        Array.from(medias).forEach(function (media) {
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



function createParser(htmlCode, baseURI, documentURI) {
    const dom = new JSDOM(htmlCode, { url: documentURI });
    const baseDoc = dom.window.document;
    Object.defineProperty(baseDoc, 'baseURI', {
        get: function () {
            return baseURI;
        }
    });
    Object.defineProperty(baseDoc, 'href', {
        get: function () {
            return documentURI;
        }
    });
    var parser = new Readability(baseDoc, {});
    parser._fixRelativeUris = createFixRelativeUris(baseURI, documentURI);
    return parser;
}

module.exports = { createFixRelativeUris, createParser };