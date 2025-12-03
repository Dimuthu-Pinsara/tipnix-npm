import { TipnixOptions } from './type';

const STYLE_ID = 'tipnix-style';

function getOrCreateStyleElement(): HTMLStyleElement {
  let styleEl = document.querySelector<HTMLStyleElement>(`#${STYLE_ID}`);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }
  return styleEl;
}

export function initTipnixTooltip(options: TipnixOptions = {}): void {
  const {
    textColor,
    backgroundColor,
    fontSize,
    animation,
    width,
    padding,
    parentWrapElement,
  } = options;

  const tooltipWrapper = document.querySelectorAll<HTMLElement>('.tipnix');
  const windowWidth = window.innerWidth;
  const direction = document.documentElement.getAttribute('dir');
  const isRtl = direction === 'rtl';
  const tipnixStyleElement = getOrCreateStyleElement();

  if (!tooltipWrapper || tooltipWrapper.length === 0) {
    console.error('Tipnix: no elements found with .tipnix');
    return;
  }

  tooltipWrapper.forEach((wrapper) => {
    const customBackgroundColor = wrapper.getAttribute('tipnix-bg') || undefined;
    const customTextColor = wrapper.getAttribute('tipnix-text-color') || undefined;
    const customFontSize = wrapper.getAttribute('tipnix-font-size') || undefined;
    const customWidth = wrapper.getAttribute('tipnix-width') || undefined;
    const customPadding = wrapper.getAttribute('tipnix-padding') || undefined;
    const customParent = wrapper.getAttribute('tipnix-parent') || undefined;
    const customAnimation = wrapper.getAttribute('tipnix-animation') || undefined;
    const tooltipTextContent = wrapper.getAttribute('tipnix-text') || '';

    const tooltipTextElement = document.createElement('span');
    tooltipTextElement.classList.add('tipnix-tooltip');

    let resolvedBackgroundColor = backgroundColor ?? '#333333';
    let resolvedTextColor = textColor ?? '#ffffff';

    const tooltipWidth = customWidth
      ? parseInt(customWidth, 10)
      : width
      ? parseInt(width, 10)
      : 225;

    tooltipTextElement.style.color = customTextColor || resolvedTextColor;
    tooltipTextElement.style.backgroundColor = customBackgroundColor || resolvedBackgroundColor;
    tooltipTextElement.style.fontSize = customFontSize || fontSize || '16px';
    tooltipTextElement.style.width =
      tooltipWidth > windowWidth
        ? `${windowWidth / 3}px`
        : customWidth || width || '225px';
    tooltipTextElement.style.padding = customPadding || padding || '16px';

    // Animation handling (same behavior as original)
    if (customAnimation) {
      const randomAnimationCssClassName = generateRandomWord(4);
      tooltipTextElement.classList.add(randomAnimationCssClassName);

      tipnixStyleElement.innerHTML += `
        .tipnix:hover .tipnix-tooltip.${randomAnimationCssClassName} {
          animation: ${customAnimation} 0.5s ease-in-out both;
        }
      `;
    } else if (animation) {
      tipnixStyleElement.innerHTML += `
        .tipnix:hover .tipnix-tooltip {
          animation: ${animation} 0.5s ease-in-out both;
        }
      `;
    } else {
      tipnixStyleElement.innerHTML += `
        .tipnix:hover .tipnix-tooltip {
          animation: shake 0.5s ease-in-out both;
        }
      `;
    }

    tooltipTextElement.textContent = tooltipTextContent;

    // Tooltip arrow background color
    if (customBackgroundColor) {
      const randomCssClassName = generateRandomWord(4);

      tooltipTextElement.classList.add(randomCssClassName);

      tipnixStyleElement.innerHTML += `
        .tipnix-tooltip.${randomCssClassName}::before {
          background: ${customBackgroundColor || '#333333'} !important;
        }
      `;
    } else {
      tipnixStyleElement.innerHTML += `
        .tipnix-tooltip::before {
          background: ${resolvedBackgroundColor || '#333333'} !important;
        }
      `;
    }

    wrapper.appendChild(tooltipTextElement);

    const wrapperWidth = wrapper.offsetWidth / 2;
    let wrapperPosition = 0;
    let parentElement: HTMLElement | null = null;

    if (customParent) {
      parentElement = document.querySelector<HTMLElement>(customParent);
      if (parentElement) {
        wrapperPosition = isRtl
          ? parentElement.getBoundingClientRect().right - wrapper.getBoundingClientRect().right
          : wrapper.getBoundingClientRect().left - parentElement.getBoundingClientRect().left;
      }
    } else if (parentWrapElement) {
      parentElement = document.querySelector<HTMLElement>(parentWrapElement);
      if (parentElement) {
        wrapperPosition = isRtl
          ? parentElement.getBoundingClientRect().right - wrapper.getBoundingClientRect().right
          : wrapper.getBoundingClientRect().left - parentElement.getBoundingClientRect().left;
      }
    } else {
      wrapperPosition = isRtl
        ? wrapper.getBoundingClientRect().right
        : wrapper.getBoundingClientRect().left;
    }

    const tooltipContentWidth = tooltipTextElement.offsetWidth;
    const tooltipContentHeight = tooltipTextElement.offsetHeight + 15;

    tooltipTextElement.style.top = `-${tooltipContentHeight}px`;

    if (wrapperPosition < tooltipContentWidth / 2) {
      if (isRtl) {
        tooltipTextElement.style.right = `${-wrapperPosition}px`;
        tooltipTextElement.style.setProperty(
          '--tooltip-before-right',
          `${wrapperPosition + wrapperWidth - 10}px`,
        );
        tooltipTextElement.style.setProperty('--tooltip-before-left', 'unset');
      } else {
        tooltipTextElement.style.left = `${-wrapperPosition}px`;
        tooltipTextElement.style.setProperty(
          '--tooltip-before-left',
          `${wrapperPosition + wrapperWidth - 2}px`,
        );
        tooltipTextElement.style.setProperty('--tooltip-before-right', 'unset');
      }
      tooltipTextElement.style.transform = 'translateX(-0%)';
    } else {
      tooltipTextElement.style.left = 'unset';
      tooltipTextElement.style.transform = 'unset';
      tooltipTextElement.style.setProperty('--tooltip-before-left', '50%');
    }
  });

  // Attach hover listeners (same behavior as original, but guarded)
  attachTipnixHoverListeners();
}

function attachTipnixHoverListeners(): void {
  const tooltipElements = document.querySelectorAll<HTMLElement>('.tipnix');

  tooltipElements.forEach((tooltipElement) => {
    // avoid double-binding if initTipnixTooltip is called multiple times
    if (tooltipElement.dataset.tipnixBound === '1') return;
    tooltipElement.dataset.tipnixBound = '1';

    tooltipElement.addEventListener('mouseenter', (event) => {
      const target = event.currentTarget as HTMLElement;
      const tooltipContentElement = target.querySelector<HTMLElement>('.tipnix-tooltip');
      if (!tooltipContentElement) return;

      tipnixTooltipSetTopPosition(target, tooltipContentElement);
    });
  });
}

export function tipnixTooltipSetTopPosition(
  wrapElement: HTMLElement,
  contentElement: HTMLElement,
): void {
  const tipnixStyleSheet = document.querySelector<HTMLStyleElement>(`#${STYLE_ID}`);
  if (!tipnixStyleSheet) {
    console.error('Tipnix: style element not found');
    return;
  }

  const wrapTop = wrapElement.getBoundingClientRect().top;
  const tooltipHeight = contentElement.offsetHeight + 15;
  const wrapHeight = wrapElement.offsetHeight + 10;

  const shouldPlaceAbove = wrapTop > tooltipHeight;

  contentElement.style.top = shouldPlaceAbove ? `-${tooltipHeight}px` : `${wrapHeight}px`;

  contentElement.classList.toggle('tooltip-above', shouldPlaceAbove);
  contentElement.classList.toggle('tooltip-below', !shouldPlaceAbove);
}

export function generateRandomWord(length = 4): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let randomWord = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomWord += characters[randomIndex];
  }

  return randomWord;
}

export function getContrastColor(hexColor: string): string {
  let color = hexColor.replace('#', '');

  if (color.length === 3) {
    color = color
      .split('')
      .map((c) => c + c)
      .join('');
  }

  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
