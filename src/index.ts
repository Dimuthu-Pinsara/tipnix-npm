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
    customClass?: string;
    zIndex?: string | number;
    arrowInset?: number;
    threshold?: number;
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
      renderAsHtml = false,
      arrowInset = 20,
      threshold = 0.9
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
      const customZIndex = getAttr(wrapper, "zindex", options.zIndex ? String(options.zIndex) : undefined);
      const customClassName = getAttr(wrapper, "class", options.customClass);
      
      const customArrowInsetAttr = getAttr(wrapper, "arrow-inset", String(arrowInset));
      const customThresholdAttr = getAttr(wrapper, "threshold", String(threshold));

      const customRenderAsHtml = customRenderHtmlAttr !== undefined 
        ? customRenderHtmlAttr !== "false" 
        : renderAsHtml;

      const finalArrowInset = !isNaN(parseInt(customArrowInsetAttr!, 10)) ? parseInt(customArrowInsetAttr!, 10) : arrowInset;
      const finalThreshold = !isNaN(parseFloat(customThresholdAttr!)) ? parseFloat(customThresholdAttr!) : threshold;
  
      const span = document.createElement("span");
      span.classList.add("tipnix-tooltip");

      // Apply external custom class if provided
      if (customClassName) {
        span.className += ` ${customClassName}`;
      }

      // Check if the user placed a custom React/HTML node inside the wrapper
      const customContentNode = wrapper.querySelector('[data-tipnix-content]');
      if (customContentNode) {
        // Automatically display it if they hid it visually
        if ((customContentNode as HTMLElement).style.display === "none") {
          (customContentNode as HTMLElement).style.display = "";
        }
        span.appendChild(customContentNode);
      } else if (customRenderAsHtml) {
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

      // Apply extended customizations
      if (customZIndex) span.style.zIndex = customZIndex;
  
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
        updatePosition(wrapper, span, viewportSafeMargin, customParent, finalArrowInset, finalThreshold);
      });
    });
  }
  
  function updatePosition(
    wrapper: HTMLElement,
    span: HTMLElement,
    viewportSafeMargin: number,
    customParent?: string,
    arrowInsetParam: number = 20,
    thresholdParam: number = 0.9
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
    // Default: Center the tooltip directly above/below the triggering element
    const wrapperCenterX = wrapRect.left + wrapRect.width / 2;
    let tooltipLeft = wrapperCenterX - contentWidth / 2;
    let shiftX = 0; // Represents the physical pixel shift from the centered origin point

    // Dynamic Threshold Layout:
    // We check how much physical space exists left/right of the trigger's center.
    const spaceLeft = wrapperCenterX - containerLeft;
    const spaceRight = containerRight - wrapperCenterX;
    
    // If available side space is less than threshold percentage of the tooltip's width, it would look cramped.
    const threshold = contentWidth * thresholdParam;
    
    // We statically position the arrow arrowInset away from the heavy-shifted tooltip edge
    const arrowInset = arrowInsetParam;

    if (spaceLeft < threshold && spaceRight >= threshold) {
      // Not enough space on the Left -> sharply push the entire tooltip body to the Right side
      // The cursor sits 24px in from the left edge of the tooltip.
      shiftX = contentWidth / 2 - arrowInset;
    } else if (spaceRight < threshold && spaceLeft >= threshold) {
      // Not enough space on the Right -> sharply push the entire tooltip body to the Left side
      // The cursor sits 24px in from the right edge of the tooltip.
      shiftX = -(contentWidth / 2 - arrowInset);
    }

    // Recalculate horizontal bounding box coordinates after structural shift
    tooltipLeft = wrapperCenterX - contentWidth / 2 + shiftX;
    
    // Safety Bounds (Viewport Clipping):
    // Regardless of our strong shifts above, NEVER push past the physical boundaries + padding
    const minLeft = containerLeft + viewportPadding;
    const maxRight = containerRight - viewportPadding;

    if (tooltipLeft < minLeft) {
      // Overflowing left bounds: push it exactly against the padded left edge
      shiftX += minLeft - tooltipLeft;
    } else if (tooltipLeft + contentWidth > maxRight) {
      // Overflowing right bounds: push it exactly against the padded right edge
      shiftX -= (tooltipLeft + contentWidth) - maxRight;
      
      // Edge case for extremely narrow screens (smaller than the tooltip width):
      if (wrapperCenterX - contentWidth / 2 + shiftX < minLeft) {
        // Left-side has stronger priority to avoid cropping readable text beginnings
        shiftX += minLeft - (wrapperCenterX - contentWidth / 2 + shiftX);
      }
    }

    // Apply translation. The baseline is `left: 50%` so we negate half width, plus calculated margins
    span.style.transform = `translateX(calc(-50% + ${shiftX}px))`;
    
    // Seamlessly tie the arrow indicator `--tooltip-before-left` to visually align
    // perfectly at the wrapper center by inversely shifting it from the `left: 50%` wrapper anchor.
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