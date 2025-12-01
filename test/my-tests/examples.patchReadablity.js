
var Readability = require("../../index").Readability;
var JSDOMParser = require("../../JSDOMParser");

var BASETESTCASE =
    '<html><body><p>Some text, <a href="/path2">link2</a> and <a class="someclass" href="#">a link</a></p>' +
    '<div id="foo">With a <script>With &lt; fancy " characters in it because' +
    '</script> that is fun.<span>And another node to make it harder</span></div><form><input type="text"/><input type="number"/>Here\'s a form</form></body></html>';


function createFixRelativeUris(baseURI, documentURI) {        
    return function _fixRelativeUris(articleContent) {
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
                // Remove links with javascript: URIs
                if (href.indexOf("javascript:") === 0) {
                    if (
                        link.childNodes.length === 1 &&
                        link.childNodes[0].nodeType === this.TEXT_NODE
                    ) {
                        var text = this._doc.createTextNode(link.textContent);
                        link.parentNode.replaceChild(text, link);
                    } else {
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
var uris = {
    baseURI: "http://fakehost2/",
    href: "http://fakehost2/post/post1"
};
var parser = createParser();
var article = parser.parse();
console.log(article.content);
let articleDoc = new JSDOMParser().parse(article.content);

// test urls in links
articleDoc.querySelectorAll('a').forEach((link) => {
    console.log('Link href:', link.getAttribute('href'));
    if (link.getAttribute('href').startsWith('javascript:')) {
        throw new Error('Link with javascript: URI was not removed');
    }
    if (link.getAttribute('href').startsWith('/')) {
        throw new Error('Relative URI was not converted to absolute');
    }
    if (link.getAttribute('href') === '#') {
        throw new Error('Hash link was incorrectly modified');
    }
});

// add parameters to the fuction 
function createParser(baseTestCase, baseURI, documentURI) {
    var baseDoc = new JSDOMParser().parse(baseTestCase);
    var mockDock = {
        baseURI: baseURI,
        href: documentURI   
    }
    var parser = new Readability(mockDock, baseDoc, {});
    parser._fixRelativeUris = createFixRelativeUris(baseURI, documentURI);
    return parser;
}
