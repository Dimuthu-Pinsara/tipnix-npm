/** Utility helpers for the TipNix tooltip library */

/** Generate a random word of given length (default 4) */
export function generateRandomWord(length: number = 4): string {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let randomWord = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomWord += characters[randomIndex];
    }
    return randomWord;
}

/** Return a contrasting color (black or white) for a given hex background */
export function getContrastColor(hexColor: string): string {
    let hex = hexColor.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map((c) => c + c).join('');
    }
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/** Update vertical position of tooltip based on available space */
export function updateVerticalPosition(wrapper: HTMLElement, tooltip: HTMLElement): void {
    const wrapTop = wrapper.getBoundingClientRect().top;
    const tooltipHeight = tooltip.offsetHeight + 15;
    const wrapHeight = wrapper.offsetHeight + 10;
    const above = wrapTop > tooltipHeight;
    tooltip.style.top = above ? `-${tooltipHeight}px` : `${wrapHeight}px`;
    tooltip.classList.toggle('tooltip-above', above);
    tooltip.classList.toggle('tooltip-below', !above);
}

/** Helper to safely read data attributes (both data-tipnix-* and tipnix-*) */
export function getAttr(el: HTMLElement, attr: string, fallback?: string): string | undefined {
    return (
        el.getAttribute(`data-tipnix-${attr}`) ??
        el.getAttribute(`tipnix-${attr}`) ??
        fallback
    );
}
