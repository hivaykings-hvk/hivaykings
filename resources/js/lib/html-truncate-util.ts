import parse, { DOMNode, Element, Text } from 'html-react-parser';

/**
 * Process HTML content and extract plain text
 * @param htmlContent - HTML content string
 * @param maxLength - Maximum length of returned text
 * @returns Processed text truncated to maxLength
 */
export const getProcessedDescription = (htmlContent: string, maxLength: number = 100) => {
    if (!htmlContent) {
        return '';
    }

    let firstParagraphContent: string | null = null;

    // Function to extract text from children nodes
    const extractText = (node: DOMNode): string => {
        if (node.type === 'text') {
            return (node as Text).data;
        }
        if (node instanceof Element) {
            return Array.from(node.children)
                .map((child) => extractText(child as DOMNode))
                .join('');
        }
        return '';
    };

    parse(htmlContent, {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.name === 'p' && firstParagraphContent === null) {
                firstParagraphContent = Array.from(domNode.children)
                    .map((child) => extractText(child as DOMNode))
                    .join('');
                // Return null for this node, as we will construct the final <p> element outside parse
                return null;
            }
            // Once the first paragraph is found, or if it's not a paragraph, discard it
            return null;
        },
    });

    if (firstParagraphContent !== null) {
        let paragraphText: string = firstParagraphContent; // Explicitly type as string
        if (paragraphText.length > maxLength) {
            paragraphText = paragraphText.substring(0, maxLength) + '...';
        }
        return paragraphText;
    }

    return ''; // Return an empty paragraph if no paragraph is found
};
