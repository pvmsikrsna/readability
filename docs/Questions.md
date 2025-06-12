### Explain how this._doc is assigned ? Where does it get the value from ?


`this._doc` is assigned in the **Readability constructor**:

````javascript
function Readability(doc, options) {
  // ...existing code...
  this._doc = doc;
  // ...existing code...
}
````

- The value for `this._doc` comes from the first argument (`doc`) passed to the `Readability` constructor.
- When you create a new instance of `Readability`, you must provide an `HTMLDocument` (or similar DOM document object) as the first parameter.
- This document object is then stored as `this._doc` and used throughout the class for DOM operations.

**Summary:**  
`this._doc` is set from the `doc` parameter when you create a new `Readability` instance. It represents the HTML document to be parsed.


### How this._doc is accessed ? Where is it accessed from ?

`this._doc` is accessed throughout the `Readability` class and its prototype methods. It is used as the reference to the DOM document being parsed and processed.

### **How is `this._doc` accessed?**
- As a property of the `Readability` instance (`this`), it is accessed using `this._doc` in any method of the class or its prototype.

### **Where is `this._doc` accessed from?**
- **Constructor:**  
  It is assigned in the constructor:
  ```javascript
  function Readability(doc, options) {
    // ...
    this._doc = doc;
    // ...
  }
  ```
- **Prototype Methods:**  
  It is accessed in many prototype methods, for example:
  - `_fixRelativeUris(articleContent)` uses `this._doc.baseURI` and `this._doc.documentURI`.
  - `_prepDocument()` uses `this._doc`.
  - `_unwrapNoscriptImages(doc)` is called with `this._doc`.
  - `_getArticleTitle()` uses `var doc = this._doc;`.
  - `_getAllNodesWithTag(node, tagNames)` uses `node.querySelectorAll` (where `node` can be `this._doc`).
  - Many other methods use `this._doc` to create elements, get elements by tag name, etc.

### **Summary**
- `this._doc` is set in the constructor from the argument passed in.
- It is accessed in almost every method of the `Readability` prototype to interact with the DOM document being processed.  
- It is always accessed as a property of the current `Readability` instance (`this`).