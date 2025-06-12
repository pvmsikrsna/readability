The `_fixRelativeUris` method in the `Readability` class is responsible for converting all relative URLs in the extracted article content to absolute URLs. This ensures that links and media (like images and videos) work correctly when the content is displayed outside its original context.

---

### **How `_fixRelativeUris` Works**

1. **Determine Base URI**
   - It gets the document's `baseURI` and `documentURI` to resolve relative URLs.

2. **Helper Function: `toAbsoluteURI`**
   - Converts a given URI to an absolute URL using the base URI.
   - Leaves hash links (e.g., `#section`) unchanged if the base URI matches the document URI.
   - Uses the `URL` constructor for resolution, and falls back to the original URI if resolution fails.

3. **Fix `<a>` Tags**
   - Finds all `<a>` elements in the article content.
   - For each link:
     - If the `href` starts with `javascript:`, it removes the link but preserves its text or children.
     - Otherwise, it sets the `href` attribute to its absolute URL using `toAbsoluteURI`.

4. **Fix Media Tags**
   - Finds all `<img>`, `<picture>`, `<figure>`, `<video>`, `<audio>`, and `<source>` elements.
   - For each media element:
     - Converts `src`, `poster`, and `srcset` attributes to absolute URLs using `toAbsoluteURI`.
     - For `srcset`, it uses a regex to replace each URL in the list.

5. **Helper Methods Used**
   - **_getAllNodesWithTag(element, tags):** Returns all descendant elements matching the given tag names.
   - **_forEachNode(nodeList, fn):** Iterates over a NodeList and applies a function to each node.

---

### **Summary**

- **Purpose:** Ensures all links and media in the article content are absolute URLs.
- **How:** Iterates over relevant elements and updates their URL attributes.
- **Key helpers:** `_getAllNodesWithTag`, `_forEachNode`, and the internal `toAbsoluteURI` function.

---

**In short:**  
`_fixRelativeUris` scans the article content for links and media, and rewrites their URLs to be absolute, so the extracted content remains functional and portable.



The `_fixRelativeUris` method is **not called directly from the `parse` method**. Instead, it is called **indirectly** through the `_postProcessContent` method.

Here’s how the call chain works:

```javascript
parse() {
  // ...existing code...
  var articleContent = this._grabArticle();
  // ...existing code...
  this._postProcessContent(articleContent); // <-- called here
  // ...existing code...
}
```

And inside `_postProcessContent`:

```javascript
_postProcessContent(articleContent) {
  this._fixRelativeUris(articleContent); // <-- called here
  // ...other post-processing...
}
```

---

### **Are there any other calls to _fixRelativeUris?**

No, in the provided code, `_fixRelativeUris` is **only called from `_postProcessContent`**.  
So, the only way it is executed is when `parse()` calls `_postProcessContent()`.

---

**Summary:**  
- `_fixRelativeUris` is called from `_postProcessContent`, which is called from `parse`.
- There are no other calls to `_fixRelativeUris` in the code you provided.