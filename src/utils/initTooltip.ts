export interface TooltipOptions {
    textColor?: string;
    backgroundColor?: string;
    fontSize?: string;
    animation?: string;
    width?: string;
    padding?: string;
    parentWrapElement?: string;
}

export function initTipNixTooltip(options: TooltipOptions = {}): void {
    const {
        textColor = '#ffffff',
        backgroundColor = '#333333',
        fontSize = '16px',
        animation,
        width = '225px',
        padding = '16px',
        parentWrapElement,
    } = options;

    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Remove any previous style element
    const existing = document.getElementById('tipnix-style');
    if (existing) existing.remove();

    const tooltipWrapper = document.querySelectorAll<HTMLElement>('.tipnix');
    const tipnixStyleElement = document.createElement('style');
    tipnixStyleElement.id = 'tipnix-style';
    document.head.appendChild(tipnixStyleElement);

    if (!tooltipWrapper.length) {
        console.error('Undefined Element');
        return;
    }

    tooltipWrapper.forEach((wrapper) => {
        if (wrapper.querySelector('.tooltip')) return; // already initialized

        const customBackgroundColor = wrapper.getAttribute('tipnix-bg');
        const customTextColor = wrapper.getAttribute('tipnix-text-color');
        const customFontSize = wrapper.getAttribute('tipnix-font-size');
        const customWidth = wrapper.getAttribute('tipnix-width');
        const customPadding = wrapper.getAttribute('tipnix-padding');
        const customParent = wrapper.getAttribute('tipnix-parent');
        const customAnimation = wrapper.getAttribute('tipnix-animation');

        const tooltipTextElement = document.createElement('span');
        const tooltipTextContent = wrapper.getAttribute('tipnix-text');
        const tooltipWidth = customWidth ? Number.parseInt(customWidth) : Number.parseInt(width);

        tooltipTextElement.classList.add('tooltip');
        tooltipTextElement.style.color = customTextColor ?? textColor;
        tooltipTextElement.style.backgroundColor = customBackgroundColor ?? backgroundColor;
        tooltipTextElement.style.fontSize = customFontSize ?? fontSize;
        tooltipTextElement.style.width = tooltipWidth > window.innerWidth ? `${window.innerWidth / 3}px` : (customWidth ?? width);
        tooltipTextElement.style.padding = customPadding ?? padding;

        if (customAnimation) {
            const randClass = generateRandomWord(4);
            tooltipTextElement.classList.add(randClass);
            tipnixStyleElement.innerHTML += `
        .tipnix:hover .tooltip.${randClass} { animation: ${customAnimation} 0.5s ease-in-out both; }
      `;
        } else if (animation) {
            tipnixStyleElement.innerHTML += `
        .tipnix:hover .tooltip { animation: ${animation} 0.5s ease-in-out both; }
      `;
        } else {
            tipnixStyleElement.innerHTML += `
        .tipnix:hover .tooltip { animation: shake 0.5s ease-in-out both; }
      `;
        }

        tooltipTextElement.textContent = tooltipTextContent ?? '';

        if (customBackgroundColor) {
            const randCss = generateRandomWord(4);
            tooltipTextElement.classList.add(randCss);
            tipnixStyleElement.innerHTML += `
        .tooltip.${randCss}::before { background: ${customBackgroundColor} !important; }
      `;
        } else {
            tipnixStyleElement.innerHTML += `
        .tooltip::before { background: ${backgroundColor} !important; }
      `;
        }

        wrapper.append(tooltipTextElement);

        // Positioning logic (same as original)
        const wrapperWidth = wrapper.offsetWidth / 2;
        let wrapperPosition = 0;
        let parentElement: HTMLElement | null = null;
        if (customParent) {
            parentElement = document.querySelector(customParent) as HTMLElement;
            wrapperPosition = isRtl()
                ? (parentElement?.getBoundingClientRect().right ?? 0) - wrapper.getBoundingClientRect().right
                : wrapper.getBoundingClientRect().left - (parentElement?.getBoundingClientRect().left ?? 0);
        } else if (parentWrapElement) {
            parentElement = document.querySelector(parentWrapElement) as HTMLElement;
            wrapperPosition = isRtl()
                ? (parentElement?.getBoundingClientRect().right ?? 0) - wrapper.getBoundingClientRect().right
                : wrapper.getBoundingClientRect().left - (parentElement?.getBoundingClientRect().left ?? 0);
        } else {
            wrapperPosition = isRtl() ? wrapper.getBoundingClientRect().right : wrapper.getBoundingClientRect().left;
        }

        const tooltipContentWidth = tooltipTextElement.offsetWidth;
        const tooltipContentHeight = tooltipTextElement.offsetHeight + 15;
        tooltipTextElement.style.top = `-${tooltipContentHeight}px`;

        if (wrapperPosition < tooltipContentWidth / 2) {
            if (isRtl()) {
                tooltipTextElement.style.right = `-${wrapperPosition}px`;
            } else {
                tooltipTextElement.style.left = `-${wrapperPosition}px`;
            }
            tooltipTextElement.style.transform = 'translateX(-0%)';
            if (isRtl()) {
                tooltipTextElement.style.setProperty('--tooltip-before-right', `${wrapperPosition + wrapperWidth - 10}px`);
                tooltipTextElement.style.setProperty('--tooltip-before-left', 'unset');
            } else {
                tooltipTextElement.style.setProperty('--tooltip-before-left', `${wrapperPosition + wrapperWidth - 2}px`);
                tooltipTextElement.style.setProperty('--tooltip-before-right', 'unset');
            }
        } else {
            tooltipTextElement.style.left = 'unset';
            tooltipTextElement.style.transform = 'unset';
            tooltipTextElement.style.setProperty('--tooltip-before-left', '50%');
        }
    });

    // Event listeners for dynamic positioning on hover
    const tooltipElements = document.querySelectorAll<HTMLElement>('.tipnix');
    tooltipElements.forEach((el) => {
        el.addEventListener('mouseenter', (e) => {
            const target = e.target as HTMLElement;
            const content = target.querySelector('.tooltip') as HTMLElement;
            if (content) tipnixTooltipSetTopPosition(target, content);
        });
    });
}

function tipnixTooltipSetTopPosition(wrap: HTMLElement, content: HTMLElement): void {
    const wrapTop = wrap.getBoundingClientRect().top;
    const tooltipHeight = content.offsetHeight + 15;
    const wrapHeight = wrap.offsetHeight + 10;
    const shouldPlaceAbove = wrapTop > tooltipHeight;
    content.style.top = shouldPlaceAbove ? `-${tooltipHeight}px` : `${wrapHeight}px`;
    content.classList.toggle('tooltip-above', shouldPlaceAbove);
    content.classList.toggle('tooltip-below', !shouldPlaceAbove);
}

function generateRandomWord(length = 4): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let word = '';
    for (let i = 0; i < length; i++) {
        word += chars[Math.floor(Math.random() * chars.length)];
    }
    return word;
}

function isRtl(): boolean {
    const dir = document.querySelector('html')?.getAttribute('dir');
    return dir === 'rtl';
}
