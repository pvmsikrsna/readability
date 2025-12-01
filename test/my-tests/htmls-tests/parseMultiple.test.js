const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const Readability = require('../../../index').Readability;
const parseMultiple = require('../../../parseMultiple');

describe('parseMultiple', () => {
    it('should extract and concatenate content from all <article> tags', () => {
        // Load test HTML file (adjust path as needed)
        const html = fs.readFileSync(path.join(__dirname, 'htmls/file.01.html'), 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Attach parseMultiple to Readability instance
        const reader = new Readability(document);
        reader.parseMultiple = parseMultiple;

        // Run parseMultiple for 'article' selector
        const result = reader.parseMultiple('article');

        expect(result).toBeDefined();
        expect(result).toHaveProperty('content');
        expect(typeof result.content).toBe('string');
        expect(result.content.length).toBeGreaterThan(0);
        expect(result.textContent.length).toBeGreaterThan(0);
        // Optionally, check for expected text from multiple articles
        expect(result.textContent).toContain('Here are the most common ways to');
        expect(result.textContent).toContain('how to trun off and on wifi on linux');
        console.log(result.textContent);
    });

    it('should return empty content if no elements match selector', () => {
        const html = '<html><body><div>No articles here</div></body></html>';
        const dom = new JSDOM(html);
        const document = dom.window.document;
        const reader = new Readability(document);
        reader.parseMultiple = parseMultiple;
        const result = reader.parseMultiple('article');
        expect(result).toBeDefined();
        expect(result.content).toBe('');
        expect(result.textContent).toBe('');
    });
});
