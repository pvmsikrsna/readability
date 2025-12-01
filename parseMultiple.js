/**
 * Custom parse method for Readability: processes all elements matching a selector,
 * grabs each article using _grabArticle(element), concatenates their HTML, and returns
 * the same result structure as the original parse method.
 * Usage: readability.parseMultiple(selector)
 */
function parseMultiple(selector) {
    // Unwrap image from noscript
    this._unwrapNoscriptImages(this._doc);
    // Extract JSON-LD metadata before removing scripts
    var jsonLd = this._disableJSONLD ? {} : this._getJSONLD(this._doc);
    // Remove script tags from the document.
    this._removeScripts(this._doc);
    this._prepDocument();
    var metadata = this._getArticleMetadata(jsonLd);
    this._metadata = metadata;
    this._articleTitle = metadata.title;

    // Find all elements matching the selector
    var elements = Array.from(this._doc.querySelectorAll(selector));
    var articles = [];
    elements.forEach(element => {
        var articleContent = this._grabArticle(element);
        if (articleContent) {
            this._postProcessContent(articleContent);
            articles.push(articleContent.innerHTML);
        }
    });
    // Concatenate all articles' HTML
    var combinedHtml = articles.join('\n');
    // Create a container for the combined result
    var container = this._doc.createElement('div');
    container.innerHTML = combinedHtml;
    // If we haven't found an excerpt in the article's metadata, use the first paragraph
    if (!metadata.excerpt) {
        var paragraphs = container.getElementsByTagName('p');
        if (paragraphs.length) {
            metadata.excerpt = paragraphs[0].textContent.trim();
        }
    }
    var textContent = container.textContent;
    return {
        title: this._articleTitle,
        byline: metadata.byline || this._articleByline,
        dir: this._articleDir,
        lang: this._articleLang,
        content: this._serializer(container),
        textContent,
        length: textContent.length,
        excerpt: metadata.excerpt,
        siteName: metadata.siteName || this._articleSiteName,
        publishedTime: metadata.publishedTime,
    };
}

module.exports = parseMultiple;
