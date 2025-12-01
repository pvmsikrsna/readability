const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const Readability = require('../../../index').Readability;

describe('Extract combined <article> sections by wrapping', () => {
    it('should extract content from all <article> tags by wrapping them in a parent div', () => {
        // Load test HTML file (adjust path as needed)
        const html = fs.readFileSync(path.join(__dirname, 'htmls/file.01.html'), 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Create a wrapper div and move all <article> nodes into it
        const wrapper = document.createElement('div');
        document.querySelectorAll('article').forEach(node => {
            wrapper.appendChild(node.cloneNode(true));
        });

        // Replace body content with the wrapper
        document.body.innerHTML = '';
        document.body.appendChild(wrapper);

        // Run Readability on the modified document
        const reader = new Readability(document);
        const result = reader.parse();

        // Assert that the result is an object and has combined content
        expect(result).toBeDefined();
        expect(result).toHaveProperty('content');
        expect(typeof result.content).toBe('string');
        // Optionally, check for expected text from multiple articles
        // expect(result.textContent).toContain('Here are the most common ways to');
        // expect(result.textContent).toContain('expected text from article 2');
    });
});
