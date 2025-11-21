export interface TipNixOptions {
    /** Text color of the tooltip */
    textColor?: string;
    /** Background color of the tooltip */
    backgroundColor?: string;
    /** Font size (e.g., "16px" or "1rem") */
    fontSize?: string;
    /** CSS animation name (must be defined globally or via @keyframes) */
    animation?: string;
    /** Width of the tooltip (e.g., "225px") */
    width?: string;
    /** Padding inside the tooltip */
    padding?: string;
    /** Selector for the parent element that limits tooltip width */
    parentWrapElement?: string;
    /** CSS selector for tooltip trigger elements (default: ".tipnix") */
    selector?: string;
}
