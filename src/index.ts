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
      selector = ".tipnix"
    } = options;
  
    const tooltips = document.querySelectorAll<HTMLElement>(selector);
    const windowWidth = window.innerWidth;
    const direction = document.documentElement.getAttribute("dir");
    const isRtl = direction === "rtl";
  
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
  
      const span = document.createElement("span");
      span.classList.add("tipnix-tooltip");
      span.textContent = tooltipTextContent;
  
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
            animation: ${animation} 0.5s ease-in-out both;
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
  
      const wrapperWidth = wrapper.offsetWidth / 2;
  
      let parentEl: HTMLElement | null = null;
      if (customParent) {
        parentEl = document.querySelector<HTMLElement>(customParent);
      } else if (parentWrapElement) {
        parentEl = document.querySelector<HTMLElement>(parentWrapElement);
      } else {
        parentEl = document.querySelector("body") as HTMLElement | null;
      }

      const wrapperRect = wrapper.getBoundingClientRect();
      const parentRect = parentEl?.getBoundingClientRect();
  
      let position: number;
      if (parentRect) {
        position = isRtl
          ? parentRect.right - wrapperRect.right
          : wrapperRect.left - parentRect.left;
      } else {
        position = isRtl ? wrapperRect.right : wrapperRect.left;
      }
  
      const contentWidth = span.offsetWidth;
      const contentHeight = span.offsetHeight + 15;
  
      span.style.top = `-${contentHeight}px`;

      if (position < contentWidth / 2) {
        if (isRtl) {
          span.style.right = `${-position}px`;
          span.style.setProperty(
            "--tooltip-before-right",
            `${position + wrapperWidth - 10}px`
          );
          span.style.setProperty("--tooltip-before-left", "unset");
        } else {
          span.style.left = `${-position}px`;
          span.style.setProperty(
            "--tooltip-before-left",
            `${position + wrapperWidth - 2}px`
          );
          span.style.setProperty("--tooltip-before-right", "unset");
        }
        span.style.transform = "translateX(0)";
      } else {
        span.style.left = "unset";
        span.style.transform = "unset";
        span.style.setProperty("--tooltip-before-left", "50%");
      }
  
      wrapper.addEventListener("mouseenter", () => {
        updateVerticalPosition(wrapper, span);
      });
    });
  }
  
  function updateVerticalPosition(wrapper: HTMLElement, span: HTMLElement): void {
    const wrapTop = wrapper.getBoundingClientRect().top;
    const tooltipHeight = span.offsetHeight + 15;
    const wrapHeight = wrapper.offsetHeight + 10;
  
    const above = wrapTop > tooltipHeight;
  
    span.style.top = above ? `-${tooltipHeight}px` : `${wrapHeight}px`;
    span.classList.toggle("tooltip-above", above);
    span.classList.toggle("tooltip-below", !above);
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