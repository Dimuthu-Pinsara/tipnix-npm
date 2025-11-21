/** Utility helpers for the TipNix tooltip library */
/** Generate a random word of given length (default 4) */
export declare function generateRandomWord(length?: number): string;
/** Return a contrasting color (black or white) for a given hex background */
export declare function getContrastColor(hexColor: string): string;
/** Update vertical position of tooltip based on available space */
export declare function updateVerticalPosition(wrapper: HTMLElement, tooltip: HTMLElement): void;
/** Helper to safely read data attributes (both data-tipnix-* and tipnix-*) */
export declare function getAttr(el: HTMLElement, attr: string, fallback?: string): string | undefined;
