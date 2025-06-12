### Notes on `createFixRelativeUris`

#### Purpose

- `createFixRelativeUris` is a **test helper** that returns a function mimicking the real `_fixRelativeUris` method from Readability.
- It allows you to inject custom `baseURI` and `documentURI` values for controlled testing of URL resolution, instead of relying on the document’s actual base URI.

---

#### Code

````javascript
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
````

---

#### Example Usage

````javascript
// Example usage in a test:
var baseDoc = new JSDOMParser().parse(BASETESTCASE);
var uris = {
    baseURI: "http://fakehost2/",
    href: "http://fakehost2/post/post1"
};
var parser = new Readability(uris, baseDoc, {});
parser._fixRelativeUris = createFixRelativeUris(uris.baseURI, uris.href);
var article = parser.parse();
console.log(article.content);
let articleDoc = new JSDOMParser().parse(article.content);
// Now you can assert that all <a> and <img> URLs are absolute as expected
````

---

**Summary:**  
- Use `createFixRelativeUris` to override `_fixRelativeUris` in tests for predictable, isolated URL resolution.  
- This is especially useful for unit testing Readability’s handling of relative URLs.