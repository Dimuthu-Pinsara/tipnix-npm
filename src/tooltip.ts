import { TipNixOptions } from './types';
import { generateRandomWord, getAttr, updateVerticalPosition } from './utils';

/**
 * Initialise tooltips on the page.
 * @param options Configuration options for default styling and behaviour.
 */
export function initTipNixTooltip(options: TipNixOptions = {}): void {
    const {
        textColor = '#ffffff',
        backgroundColor = '#333333',
        fontSize = '16px',
        animation,
        width = '225px',
        padding = '16px',
        parentWrapElement,
        selector = '.tipnix',
    } = options;

    const tooltips = document.querySelectorAll<HTMLElement>(selector);
    if (!tooltips.length) return;

    // Ensure a single style element exists
    let styleEl = document.querySelector<HTMLStyleElement>('#tipnix-style');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'tipnix-style';
        document.head.appendChild(styleEl);
    }

    const windowWidth = window.innerWidth;
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';

    tooltips.forEach((wrapper) => {
        // Resolve per‑element overrides via data attributes
        const customBackgroundColor = getAttr(wrapper, 'bg', backgroundColor);
        const customTextColor = getAttr(wrapper, 'text-color', textColor);
        const customFontSize = getAttr(wrapper, 'font-size', fontSize);
        const customWidth = getAttr(wrapper, 'width', width);
        const customPadding = getAttr(wrapper, 'padding', padding);
        const customParent = getAttr(wrapper, 'parent', parentWrapElement);
        const customAnimation = getAttr(wrapper, 'animation', animation);
        const tooltipText = getAttr(wrapper, 'text', '') ?? '';

        // Create tooltip element
        const tooltip = document.createElement('span');
        tooltip.classList.add('tipnix-tooltip');
        tooltip.textContent = tooltipText;
        tooltip.style.color = customTextColor || textColor;
        tooltip.style.backgroundColor = customBackgroundColor || backgroundColor;
        tooltip.style.fontSize = customFontSize || fontSize;
        tooltip.style.padding = customPadding || padding;
        // Width handling – clamp to viewport width
        const parsedWidth = parseInt(customWidth!);
        tooltip.style.width =
            parsedWidth > windowWidth ? `${windowWidth - 50}px` : customWidth!;

        // Animation handling
        if (customAnimation) {
            const animClass = generateRandomWord(4);
            tooltip.classList.add(animClass);
            styleEl!.innerHTML += `
        ${selector}:hover .${animClass} {
          animation: ${customAnimation} 0.5s ease-in-out both;
        }
      `;
        } else {
            // default shake animation (user can provide their own via CSS)
            styleEl!.innerHTML += `
        ${selector}:hover .tipnix-tooltip {
          animation: shake 0.5s ease-in-out both;
        }
      `;
        }

        // Append tooltip to wrapper
        wrapper.appendChild(tooltip);

        // Positioning logic
        const wrapperRect = wrapper.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const parentEl = customParent
            ? document.querySelector<HTMLElement>(customParent)
            : parentWrapElement
                ? document.querySelector<HTMLElement>(parentWrapElement)
                : null;

        // Horizontal offset calculation
        let offset = 0;
        if (parentEl) {
            const parentRect = parentEl.getBoundingClientRect();
            offset = isRtl
                ? parentRect.right - wrapperRect.right
                : wrapperRect.left - parentRect.left;
        } else {
            offset = isRtl ? wrapperRect.right : wrapperRect.left;
        }

        // Apply horizontal positioning
        if (offset < tooltipRect.width / 2) {
            if (isRtl) {
                tooltip.style.right = `${-offset}px`;
                tooltip.style.setProperty('--tooltip-before-right', `${offset + wrapperRect.width - 10}px`);
                tooltip.style.setProperty('--tooltip-before-left', 'unset');
            } else {
                tooltip.style.left = `${-offset}px`;
                tooltip.style.setProperty('--tooltip-before-left', `${offset + wrapperRect.width - 2}px`);
                tooltip.style.setProperty('--tooltip-before-right', 'unset');
            }
        } else {
            tooltip.style.left = 'unset';
            tooltip.style.setProperty('--tooltip-before-left', '50%');
        }

        // Vertical positioning on hover
        wrapper.addEventListener('mouseenter', () => {
            updateVerticalPosition(wrapper, tooltip);
        });
    });
}
