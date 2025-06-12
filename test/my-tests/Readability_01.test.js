var chai = require("chai");
// chai.config.includeStack = true;
// var expect = chai.expect;
const expect = require('chai').expect;

var Readability = require("../../index").Readability;
var JSDOMParser = require("../../JSDOMParser");

var BASETESTCASE =
    '<html><body><p>Some text, <a href="/path2">link2</a> and <a class="someclass" href="#">a link</a></p>' +
    '<div id="foo">With a <script>With &lt; fancy " characters in it because' +
    '</script> that is fun.<span>And another node to make it harder</span></div><form><input type="text"/><input type="number"/>Here\'s a form</form></body></html>';

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
        // var baseURI = this._doc.baseURI;
        // var documentURI = this._doc.documentURI;
        function toAbsoluteURI(uri) {
            // Leave hash links alone if the base URI matches the document URI:
            if (baseURI == documentURI && uri.charAt(0) == "#") {
                return uri;
            }

            // Otherwise, resolve against base URI:
            try {
                return new URL(uri, baseURI).href;
            } catch (ex) {
                // Something went wrong, just return the original:
            }
            return uri;
        }

        var links = this._getAllNodesWithTag(articleContent, ["a"]);
        this._forEachNode(links, function (link) {
            var href = link.getAttribute("href");
            if (href) {
                // Remove links with javascript: URIs, since
                // they won't work after scripts have been removed from the page.
                if (href.indexOf("javascript:") === 0) {
                    // if the link only contains simple text content, it can be converted to a text node
                    if (
                        link.childNodes.length === 1 &&
                        link.childNodes[0].nodeType === this.TEXT_NODE
                    ) {
                        var text = this._doc.createTextNode(link.textContent);
                        link.parentNode.replaceChild(text, link);
                    } else {
                        // if the link has multiple children, they should all be preserved
                        var container = this._doc.createElement("span");
                        while (link.firstChild) {
                            container.appendChild(link.firstChild);
                        }
                        link.parentNode.replaceChild(container, link);
                    }
                } else {
                    link.setAttribute("href", toAbsoluteURI(href));
                }
            }
        });

        var medias = this._getAllNodesWithTag(articleContent, [
            "img",
            "picture",
            "figure",
            "video",
            "audio",
            "source",
        ]);

        this._forEachNode(medias, function (media) {
            var src = media.getAttribute("src");
            var poster = media.getAttribute("poster");
            var srcset = media.getAttribute("srcset");

            if (src) {
                media.setAttribute("src", toAbsoluteURI(src));
            }

            if (poster) {
                media.setAttribute("poster", toAbsoluteURI(poster));
            }

            if (srcset) {
                var newSrcset = srcset.replace(
                    this.REGEXPS.srcsetUrl,
                    function (_, p1, p2, p3) {
                        return toAbsoluteURI(p1) + (p2 || "") + p3;
                    }
                );

                media.setAttribute("srcset", newSrcset);
            }
        });
    }
}


describe('Readability', () => {
    it('should run a test in the local environment', () => {
        // This is a placeholder for an actual test
        expect(true).to.equal(true);
    });

    it('should passing baseURI and documentURI as asrgument', () => {
        var baseDoc = new JSDOMParser().parse(BASETESTCASE);
        var uris = {
            baseURI: "http://fakehost2/",
            href: "http://fakehost2/"
        };
        var parser = new Readability(uris, baseDoc, {})
        var article = parser.parse();
        let articleDoc = new JSDOMParser().parse(article.content);
        expect(article).to.be.an('object');
        articleDoc.querySelectorAll('a').forEach((link) => {
            expect(link.href).to.include('http://fakehost/');
        });
    });

    it('should fix relative urls', () => {
        var baseDoc = new JSDOMParser().parse(BASETESTCASE);
        var uris = {
            baseURI: "http://fakehost2/",
            href: "http://fakehost2/post/post1"
        };
        var parser = new Readability(uris, baseDoc, {})
        parser._fixRelativeUris = createFixRelativeUris(uris.baseURI, uris.href);
        var article = parser.parse();
        console.log(article.content);
        let articleDoc = new JSDOMParser().parse(article.content);
        expect(article).to.be.an('object');
    });

    it('REGEXPS.positive is accessible from instance', () => {
        var baseDoc = new JSDOMParser().parse(BASETESTCASE, "http://fakehost/");
        var readability = new Readability(baseDoc, {})

        expect(readability.REGEXPS).to.be.an('object');

        const prototypeSource = Readability.prototype.REGEXPS['positive'].source;
        const unmodified = readability.REGEXPS['positive'].source;

        readability.REGEXPS['positive'] = new RegExp(unmodified.replace('article', `article|data-huuid`), 'i');

        expect(readability.REGEXPS['positive'].source).to.include('data-huuid');

        expect(prototypeSource).to.equal(unmodified, 'Readability prototype REGEXPS should not be modified');

    });
});

