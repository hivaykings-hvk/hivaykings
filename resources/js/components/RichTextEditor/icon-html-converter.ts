/**
 * Converts icon HTML elements in the editor output to JSX format
 * Transforms: <span data-name="FaCalendarDay" data-type="icon"></span>
 * To: <FaCalendarDay className="w-6 h-6 text-primary" />
 */

const ICON_NAMES = ['FaCalendarDay', 'FaImages', 'FaVideo', 'FaLocationDot', 'FaRoute'];

export function convertIconsToJSX(html: string): string {
    let result = html;

    for (const iconName of ICON_NAMES) {
        const iconRegex = new RegExp(`<span\\s+data-name="${iconName}"\\s+data-type="icon"[^>]*><\\/span>`, 'g');
        const jsxReplacement = `<${iconName} className="w-5 h-5 text-primary" />`;
        result = result.replace(iconRegex, jsxReplacement);
    }

    return result;
}

/**
 * Converts JSX icon format back to HTML for the editor
 * Transforms: <FaCalendarDay className="w-6 h-6 text-primary" />
 * To: <span data-icon="FaCalendarDay" data-type="icon"></span>
 */
export function convertJSXToIconsHTML(content: string): string {
    let result = content;

    for (const iconName of ICON_NAMES) {
        const jsxRegex = new RegExp(`<${iconName}\\s+className="w-6 h-6 text-primary"\\s*/>`, 'g');
        const htmlReplacement = `<span data-name="${iconName}" data-type="icon"></span>`;
        result = result.replace(jsxRegex, htmlReplacement);
    }

    return result;
}
