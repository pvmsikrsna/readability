const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const Readability = require('../../../index').Readability;

describe('Extract all <article> sections', () => {
    it('should extract content from all <article> tags in the HTML', () => {
        // Load test HTML file (adjust path as needed)
        const html = fs.readFileSync(path.join(__dirname, 'htmls/file.01.html'), 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Find all <article> elements
        const articleNodes = Array.from(document.querySelectorAll('article'));
        expect(articleNodes.length).toBeGreaterThan(0);

        // Extract content from each <article> using Readability
        const extractedArticles = articleNodes.map((node) => {
            // Create a new document for each article node
            const tempDom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
            const tempDoc = tempDom.window.document;
            tempDoc.body.appendChild(node.cloneNode(true));

            // Run Readability on the new document
            const reader = new Readability(tempDoc);
            return reader.parse();
        });

        // Assert that each extracted article is an object and has content
        extractedArticles.forEach((result, idx) => {
            expect(result).toBeDefined();
            expect(result).toHaveProperty('content');
            expect(typeof result.content).toBe('string');
            // Optionally, check for expected text in each article
            // expect(result.textContent).toContain('expected text');
        });
    });
});
