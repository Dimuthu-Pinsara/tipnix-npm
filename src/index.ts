import "./styles/tipnix.css";

export interface TipNixOptions {
    textColor?: string;
    backgroundColor?: string;
    fontSize?: string;
    animation?: string;
    width?: string;
    padding?: string;
    parentWrapElement?: string;
    selector?: string;
    viewportSafeMargin?: number;
    renderAsHtml?: boolean;
  }
  
  // Helper to support both data-tipnix-* (recommended) and legacy tipnix-*
  function getAttr(
    el: HTMLElement,
    attr: string,
    fallback?: string
  ): string | undefined {
    return (
      el.getAttribute(`data-tipnix-${attr}`) ??
      el.getAttribute(`tipnix-${attr}`) ??
      fallback
    );
  }
  
  export function initTipNixTooltip(options: TipNixOptions = {}): void {
    const {
      textColor = "#ffffff",
      backgroundColor = "#333333",
      fontSize = "16px",
      animation,
      width = "225px",
      padding = "16px",
      parentWrapElement,
      selector = ".tipnix",
      viewportSafeMargin = 16,
      renderAsHtml = false
    } = options;
  
    const tooltips = document.querySelectorAll<HTMLElement>(selector);
    const windowWidth = window.innerWidth;
    
    if (!tooltips.length) return;
  
    let styleEl = document.querySelector<HTMLStyleElement>("#tipnix-style");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "tipnix-style";
      document.head.appendChild(styleEl);
    }
  
    tooltips.forEach((wrapper) => {
      const customBackgroundColor = getAttr(wrapper, "bg", backgroundColor)!;
      const customTextColor = getAttr(wrapper, "text-color", textColor)!;
      const customFontSize = getAttr(wrapper, "font-size", fontSize)!;
      const customWidth = getAttr(wrapper, "width", width)!;
      const customPadding = getAttr(wrapper, "padding", padding)!;
      const customParent = getAttr(wrapper, "parent", parentWrapElement);
      const customAnimation = getAttr(wrapper, "animation", animation);
      const tooltipTextContent = getAttr(wrapper, "text", "") || "";
      const customRenderHtmlAttr = getAttr(wrapper, "render-html");
      
      const customRenderAsHtml = customRenderHtmlAttr !== undefined 
        ? customRenderHtmlAttr !== "false" 
        : renderAsHtml;
  
      const span = document.createElement("span");
      span.classList.add("tipnix-tooltip");
      if (customRenderAsHtml) {
        span.innerHTML = tooltipTextContent;
      } else {
        span.textContent = tooltipTextContent;
      }
  
      const parsedWidth = parseInt(customWidth, 10);
      const effectiveWidth =
        parsedWidth > windowWidth ? `${windowWidth / 3}px` : customWidth;
  
      span.style.color = customTextColor;
      span.style.backgroundColor = customBackgroundColor;
      span.style.fontSize = customFontSize;
      span.style.width = effectiveWidth;
      span.style.padding = customPadding;
  
      // Animation rules
      if (customAnimation) {
        const rand = generateRandomWord(4);
        span.classList.add(rand);
        styleEl!.innerHTML += `
          ${selector}:hover .${rand} {
            animation: ${customAnimation} 0.5s ease-in-out both;
          }
        `;
      } else if (animation) {
        styleEl!.innerHTML += `
          ${selector}:hover .tipnix-tooltip {
            animation: tipnix-${animation} 0.5s ease-in-out both;
          }
        `;
      } else {
        styleEl!.innerHTML += `
          ${selector}:hover .tipnix-tooltip {
            animation: shake 0.5s ease-in-out both;
          }
        `;
      }

      const existingTooltips = wrapper.querySelectorAll(".tipnix-tooltip");
      existingTooltips.forEach((el) => el.remove());
  
      span.style.setProperty("--tooltip-before-left", "50%");
      wrapper.appendChild(span);
  
      span.style.top = `-${span.offsetHeight + 8}px`;
      span.style.left = "50%";
      span.style.right = "unset";
      span.style.transform = "translateX(-50%)";
      span.classList.add("tooltip-above");

      wrapper.addEventListener("mouseenter", () => {
        updatePosition(wrapper, span, viewportSafeMargin, customParent);
      });
    });
  }
  
  function updatePosition(
    wrapper: HTMLElement,
    span: HTMLElement,
    viewportSafeMargin: number,
    customParent?: string
  ): void {
    const wrapRect = wrapper.getBoundingClientRect();
    
    let containerLeft = 0;
    let containerRight = document.documentElement.clientWidth || window.innerWidth;

    if (customParent) {
      const parentEl = document.querySelector<HTMLElement>(customParent);
      if (parentEl) {
        const parentRect = parentEl.getBoundingClientRect();
        containerLeft = parentRect.left;
        containerRight = parentRect.right;
      }
    }
    
    const safeMarginAttr = getAttr(wrapper, "safe-margin");
    const viewportPadding = safeMarginAttr && !isNaN(parseInt(safeMarginAttr, 10))
      ? parseInt(safeMarginAttr, 10)
      : viewportSafeMargin;

    const contentWidth = span.offsetWidth;
    const tooltipHeight = span.offsetHeight + 8;
    const wrapHeight = wrapper.offsetHeight + 8;
  
    // Vertical position
    const above = wrapRect.top > tooltipHeight;
    span.style.top = above ? `-${tooltipHeight}px` : `${wrapHeight}px`;
    span.classList.toggle("tooltip-above", above);
    span.classList.toggle("tooltip-below", !above);

    // Horizontal position
    const wrapperCenterX = wrapRect.left + wrapRect.width / 2;
    let tooltipLeft = wrapperCenterX - contentWidth / 2;
    let shiftX = 0;

    const minLeft = containerLeft + viewportPadding;
    if (tooltipLeft < minLeft) {
      shiftX = minLeft - tooltipLeft;
    }

    const maxRight = containerRight - viewportPadding;
    if (tooltipLeft + contentWidth > maxRight) {
      shiftX = maxRight - (tooltipLeft + contentWidth);
      if (tooltipLeft + shiftX < minLeft) {
        shiftX = minLeft - tooltipLeft;
      }
    }

    span.style.transform = `translateX(calc(-50% + ${shiftX}px))`;
    span.style.setProperty(
      "--tooltip-before-left",
      `calc(50% - ${shiftX}px)`
    );
  }
  
  function generateRandomWord(length = 4): string {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    return Array.from({ length }, () => chars[(Math.random() * chars.length) | 0]).join("");
  }
  
  // Optional utility export
  export function getContrastColor(hexColor: string): string {
    if (!hexColor) return "#FFFFFF";
    hexColor = hexColor.replace("#", "");
  
    if (hexColor.length === 3) {
      hexColor = hexColor
        .split("")
        .map((c) => c + c)
        .join("");
    }
  
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);
  
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  }