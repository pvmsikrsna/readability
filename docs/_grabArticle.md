The `_grabArticle` method is the core of the Readability algorithm. Its purpose is to analyze the DOM and extract the main content of an article, filtering out navigation, ads, comments, and other non-essential elements. Here’s how it works and the main functions it calls:

---

### **How `_grabArticle` Works**

1. **Preparation & Node Scanning**
   - Starts with the document body (or a given page node).
   - Iterates through all nodes, removing hidden or unlikely candidates (ads, sidebars, etc.) using heuristics (class names, roles, etc.).
   - Converts certain `<div>`s into `<p>`s if they look like paragraphs.

2. **Scoring Content Nodes**
   - Collects nodes likely to be content (paragraphs, headings, etc.).
   - For each, calculates a **content score** based on:
     - Length of text
     - Number of commas
     - Class/ID names (positive/negative keywords)
     - Link density (less is better)
   - Scores are also distributed to ancestor nodes (parents, grandparents, etc.).

3. **Selecting the Top Candidate**
   - Finds the node with the highest content score (the "top candidate").
   - May adjust the candidate if its parent or ancestor has a better score or contains more related content.

4. **Sibling Merging**
   - Looks at siblings of the top candidate to include related content (e.g., preambles, split paragraphs).
   - Merges siblings that have a high enough score or look like content.

5. **Cleanup**
   - Cleans up the extracted content (removes forms, ads, footers, etc.).
   - Converts certain tags, removes empty paragraphs, and fixes structure.

6. **Fallbacks & Retries**
   - If not enough content is found, retries with less strict filtering.
   - Returns the best attempt if all else fails.

7. **Returns**
   - The cleaned article content as a DOM element.

---

### **Key Methods Called by `_grabArticle`**

- **_isProbablyVisible(node):** Checks if a node is visible.
- **_removeAndGetNext(node):** Removes a node and returns the next node to process.
- **_isValidByline(node, matchString):** Checks if a node is likely to be an author byline.
- **_headerDuplicatesTitle(node):** Checks if a header duplicates the article title.
- **_hasAncestorTag(node, tag):** Checks if a node has a specific ancestor tag.
- **_isElementWithoutContent(node):** Checks if a node is empty or only contains whitespace.
- **_hasSingleTagInsideElement(node, tag):** Checks if a node contains only one child of a given tag.
- **_hasChildBlockElement(node):** Checks if a node contains block-level elements.
- **_isPhrasingContent(node):** Checks if a node is phrasing content (inline elements).
- **_isWhitespace(node):** Checks if a node is whitespace.
- **_getNextNode(node, ignoreSelfAndKids):** Gets the next node in DOM traversal.
- **_getInnerText(node):** Gets the text content of a node.
- **_getNodeAncestors(node, maxDepth):** Gets a list of ancestor nodes.
- **_initializeNode(node):** Initializes a node's readability score.
- **_getClassWeight(node):** Scores a node based on class/id names.
- **_getLinkDensity(node):** Calculates the ratio of text inside links.
- **_prepArticle(articleContent):** Cleans up the extracted article content.
- **_clean, _cleanConditionally, _cleanMatchedNodes:** Remove unwanted elements.
- **_setNodeTag(node, tag):** Changes the tag of a node.
- **_forEachNode, _someNode, _everyNode:** Utility functions for node iteration.

---

### **Summary**

`_grabArticle` is a multi-step process that:
- Scores and filters nodes to find the main content,
- Merges related content,
- Cleans up the result,
- And returns the main article as a DOM element.

It relies on many helper methods for DOM traversal, scoring, and cleanup, making it the heart of the Readability extraction process.