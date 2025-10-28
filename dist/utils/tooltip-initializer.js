"use client";
import { useEffect, useRef, useCallback } from "react";

export function useTooltip(options = {}) {
  const initialized = useRef(false);

  const addTooltipStyles = useCallback((backgroundColor) => {
    if (typeof document === "undefined") return;

    // replace old base style to avoid stacking
    document.getElementById("tipnix-animations")?.remove();

    const style = document.createElement("style");
    style.id = "tipnix-animations";
    style.innerHTML = `
      .tipnix {
        position: relative;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
        font-size: 18px;
        font-weight: 600;
        color: var(--color);
        border-radius: 8px;
        text-transform: uppercase;
        height: auto;
        width: max-content;
        display: grid;
        place-items: center;
      }

      .tipnix-tooltip {
        position: absolute;
        width: 225px;
        top: 0;
        left: 50%;
        padding: 10px;
        opacity: 0;
        pointer-events: none;
        transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
        background: var(--background);
        z-index: 100;
        border-radius: 8px;
        font-weight: 500;
        font-size: 16px;
        box-shadow: 0 10px 10px rgba(0,0,0,0.1);
      }

      .tipnix-tooltip::before {
        position: absolute;
        content: "";
        height: 0.6em;
        width: 0.6em;
        bottom: var(--tooltip-before-bottom, -0.2em);
        top: var(--tooltip-before-top, -0.2em);
        left: var(--tooltip-before-left, 0);
        right: var(--tooltip-before-right, unset);
        transform: translate(-50%) rotate(45deg);
        background: ${backgroundColor || "#333333"} !important;
      }

      .tipnix:hover .tipnix-tooltip {
        top: -100%;
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        scale: 1;
      }

      .tipnix:hover {
        box-shadow: 0 10px 10px rgba(0,0,0,0.1);
        color: white;
        border-color: transparent;
      }

      .tooltip-above::before { top: unset !important; bottom: -0.2em !important; }
      .tooltip-below::before { top: -0.2em !important; bottom: unset !important; }

      @keyframes shake { 0%{rotate:0} 25%{rotate:7deg} 50%{rotate:-7deg} 75%{rotate:1deg} 100%{rotate:0} }
      @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      @keyframes fadeSlideUp { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
      @keyframes zoom { 0%{transform:scale(0.8)} 50%{transform:scale(1.2)} 100%{transform:scale(1)} }
      @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.8} }
      @keyframes flipIn { 0%{transform:rotateX(-90deg);opacity:0} 100%{transform:rotateX(0);opacity:1} }
      @keyframes slideInLeft { 0%{transform:translateX(-20px);opacity:0} 100%{transform:translateX(0);opacity:1} }
      @keyframes swing { 0%{transform:rotate(0)} 20%{rotate:15deg} 40%{rotate:-10deg} 60%{rotate:5deg} 80%{rotate:-5deg} 100%{rotate:0} }
      @keyframes fadeInScale { 0%{opacity:0;transform:scale(0.8)} 100%{opacity:1;transform:scale(1)} }
      @keyframes tiltFadeIn { 0%{opacity:0;transform:rotate(-10deg) translateY(10px)} 100%{opacity:1;transform:rotate(0) translateY(0)} }
    `;
    document.head.appendChild(style);

    return () => document.getElementById("tipnix-animations")?.remove();
  }, []);

  const tipnixTooltipSetTopPosition = useCallback((wrapElement, contentElement) => {
    const tipnixStyleSheet = document.querySelector("#tipnix-style");
    if (!tipnixStyleSheet) {
      console.error("Style element not found");
      return;
    }
    const wrapTop = wrapElement.getBoundingClientRect().top;
    const tooltipHeight = contentElement.offsetHeight + 15;
    const wrapHeight = wrapElement.offsetHeight + 10;
    const shouldPlaceAbove = wrapTop > tooltipHeight;

    contentElement.style.top = shouldPlaceAbove ? `-${tooltipHeight}px` : `${wrapHeight}px`;
    contentElement.classList.toggle("tooltip-above", shouldPlaceAbove);
    contentElement.classList.toggle("tooltip-below", !shouldPlaceAbove);
  }, []);

  function generateRandomWord(length = 4) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let out = "";
    for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  const initTipNixTooltip = useCallback((opts = {}) => {
    const {
      textColor = "#ffffff",
      backgroundColor = "#333333",
      fontSize = "16px",
      animation,
      width = "225px",
      padding = "16px",
      parentWrapElement,
    } = opts;

    if (typeof window === "undefined" || typeof document === "undefined") return;

    // Reset style tag to avoid duplicates (same id as your pure JS)
    document.getElementById("tipnix-style")?.remove();

    let tooltipWrapper = document.querySelectorAll(".tipnix");
    let tipnixStyleElement = document.createElement('style');
    let windowWidth = window.innerWidth;
    let direction = document.querySelector("html").getAttribute("dir");
    let isRtl = direction === "rtl" ? true : false;
    tipnixStyleElement.setAttribute('id', 'tipnix-style');
    document.head.appendChild(tipnixStyleElement);

    if (!tooltipWrapper || tooltipWrapper.length === 0) {
        console.error("Undefined Element");
        return;
    }

    tooltipWrapper.forEach(wrapper => {

        const customBackgroundColor = wrapper.getAttribute("tipnix-bg");
        const customTextColor = wrapper.getAttribute("tipnix-text-color");
        const customFontSize = wrapper.getAttribute("tipnix-font-size");
        const customWidth = wrapper.getAttribute("tipnix-width");
        const customPadding = wrapper.getAttribute("tipnix-padding");
        const customParent = wrapper.getAttribute("tipnix-parent");
        const customAnimation = wrapper.getAttribute("tipnix-animation");
        let tooltipTextElement = document.createElement("span");
        let tooltipTextContent = wrapper.getAttribute("tipnix-text");
        let tooltipWidth = customWidth ? parseInt(customWidth) : (width ? parseInt(width) : 225);
        backgroundColor = backgroundColor ?? '#333333';
        textColor = textColor ?? '#ffffff';
        tooltipTextElement.classList.add("tipnix-tooltip");
        tooltipTextElement.style.color = customTextColor ? customTextColor : textColor;
        tooltipTextElement.style.backgroundColor = customBackgroundColor ? customBackgroundColor : backgroundColor;
        tooltipTextElement.style.fontSize = customFontSize ? customFontSize : (fontSize || '16px');
        tooltipTextElement.style.width = tooltipWidth > windowWidth
            ? `${windowWidth - 50}px`
            : (customWidth ? customWidth : (width ? width : '225px'));
        tooltipTextElement.style.padding = customPadding ? customPadding : (padding ? padding : '16px');

        if (customAnimation) {
            let randomAnimationCssClassName = generateRandomWord(4);
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

        if (customBackgroundColor) {
            let randomCssClassName = generateRandomWord(4);

            tooltipTextElement.classList.add(randomCssClassName);

            tipnixStyleElement.innerHTML += `
                .tipnix-tooltip.${randomCssClassName}::before {
                    background: ${customBackgroundColor || '#333333'} !important;
                }
            `;
        } else {

            tipnixStyleElement.innerHTML += `
                .tipnix-tooltip::before {
                    background: ${backgroundColor || '#333333'} !important;
                }
            `;
        }

        wrapper.append(tooltipTextElement);

        let wrapperWidth = wrapper.offsetWidth / 2;
        let wrapperPosition = 0;
        let parentElement = null

        if (customParent) {
            parentElement = document.querySelector(customParent);
            wrapperPosition = isRtl ? parentElement.getBoundingClientRect().right - wrapper.getBoundingClientRect().right : wrapper.getBoundingClientRect().left - parentElement.getBoundingClientRect().left;
        } else if (parentWrapElement) {
            parentElement = document.querySelector(parentWrapElement);
            wrapperPosition = isRtl ? parentElement.getBoundingClientRect().right - wrapper.getBoundingClientRect().right : wrapper.getBoundingClientRect().left - parentElement.getBoundingClientRect().left;
        } else {
            wrapperPosition = isRtl ? wrapper.getBoundingClientRect().right : wrapper.getBoundingClientRect().left;
        }

        let tooltipContentWidth = tooltipTextElement.offsetWidth;
        let tooltipContentHeight = tooltipTextElement.offsetHeight + 15;

        tooltipTextElement.style.top = -tooltipContentHeight + 'px';

        if (wrapperPosition < (tooltipContentWidth / 2)) {
            isRtl ? tooltipTextElement.style.right = -wrapperPosition + 'px' : tooltipTextElement.style.left = -wrapperPosition + 'px';
            tooltipTextElement.style.transform = "translateX(-0%)";
            if (isRtl) {
                tooltipTextElement.style.setProperty('--tooltip-before-right', `${(wrapperPosition + wrapperWidth) - 10}px`);
                tooltipTextElement.style.setProperty('--tooltip-before-left', `unset`);
            } else {
                tooltipTextElement.style.setProperty('--tooltip-before-left', `${(wrapperPosition + wrapperWidth) - 2}px`);
                tooltipTextElement.style.setProperty('--tooltip-before-right', `unset`);
            }
        } else {
            tooltipTextElement.style.left = 'unset';
            tooltipTextElement.style.transform = "unset";
            tooltipTextElement.style.setProperty('--tooltip-before-left', `50%`);
        }
    });

    // Hover: compute above/below
    const tooltipElements = document.querySelectorAll(".tipnix");
    tooltipElements.forEach((tooltipElement) => {
      tooltipElement.addEventListener("mouseenter", (event) => {
        const el = event.currentTarget;
        const content = el?.querySelector(".tipnix-tooltip");
        if (content) tipnixTooltipSetTopPosition(tooltipElement, content);
      });
    });

    initialized.current = true;
  }, [tipnixTooltipSetTopPosition]);

  useEffect(() => {
    const { backgroundColor = "#333333" } = options;
    const cleanupBase = addTooltipStyles(backgroundColor);

    const timer = setTimeout(() => {
      initTipNixTooltip(options);
    }, 100);

    // Re-init on DOM insertions
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          for (const node of m.addedNodes) {
            if (node instanceof HTMLElement && (node.classList.contains("tipnix") || node.querySelector?.(".tipnix"))) {
              initTipNixTooltip(options);
              return;
            }
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Re-init on resize
    const onResize = () => initTipNixTooltip(options);
    window.addEventListener("resize", onResize);

    // Re-init when html dir changes
    const html = document.querySelector("html");
    let dirObs = null;
    if (html) {
      dirObs = new MutationObserver(() => initTipNixTooltip(options));
      dirObs.observe(html, { attributes: true, attributeFilter: ["dir"] });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      dirObs?.disconnect();
      cleanupBase?.();
      document.getElementById("tipnix-style")?.remove();
    };
  }, [options, addTooltipStyles, initTipNixTooltip]);

  return {
    reinitialize: () => initTipNixTooltip(options),
    isInitialized: initialized.current,
  };
}

export function TooltipProvider({
  options = { textColor: "#ffffff", backgroundColor: "#333333" },
}) {
  useTooltip(options);
  return null;
}
