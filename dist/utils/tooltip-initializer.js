"use client";
import { useEffect, useRef, useCallback } from "react";
export function useTooltip(options = {}) {
    const initialized = useRef(false);
    const initTipNixTooltip = useCallback((options = {}) => {
        var _a, _b;
        const { textColor = "#ffffff", backgroundColor = "#333333", fontSize = "16px", animation, width = "225px", padding = "16px", parentWrapElement, } = options;
        // Only run on client-side
        if (typeof window === "undefined" || typeof document === "undefined") {
            return;
        }
        // Prevent duplicate initialization
        if (document.getElementById("tipnix-style")) {
            (_a = document.getElementById("tipnix-style")) === null || _a === void 0 ? void 0 : _a.remove();
        }
        const tooltipWrapper = document.querySelectorAll(".tipnix");
        const tipnixStyleElement = document.createElement("style");
        const windowWidth = window.innerWidth;
        const direction = (_b = document.querySelector("html")) === null || _b === void 0 ? void 0 : _b.getAttribute("dir");
        const isRtl = direction === "rtl" ? true : false;
        tipnixStyleElement.setAttribute("id", "tipnix-style");
        document.head.appendChild(tipnixStyleElement);
        if (!tooltipWrapper || tooltipWrapper.length === 0) {
            console.error("Undefined Element");
            return;
        }
        tooltipWrapper.forEach((wrapper) => {
            // Skip if this tooltip has already been initialized
            if (wrapper.querySelector(".tooltip")) {
                return;
            }
            const customBackgroundColor = wrapper.getAttribute("tipnix-bg");
            const customTextColor = wrapper.getAttribute("tipnix-text-color");
            const customFontSize = wrapper.getAttribute("tipnix-font-size");
            const customWidth = wrapper.getAttribute("tipnix-width");
            const customPadding = wrapper.getAttribute("tipnix-padding");
            const customParent = wrapper.getAttribute("tipnix-parent");
            const customAnimation = wrapper.getAttribute("tipnix-animation");
            const tooltipTextElement = document.createElement("span");
            const tooltipTextContent = wrapper.getAttribute("tipnix-text");
            const tooltipWidth = customWidth ? Number.parseInt(customWidth) : width ? Number.parseInt(width) : 225;
            tooltipTextElement.classList.add("tooltip");
            tooltipTextElement.style.color = customTextColor ? customTextColor : textColor;
            tooltipTextElement.style.backgroundColor = customBackgroundColor ? customBackgroundColor : backgroundColor;
            tooltipTextElement.style.fontSize = customFontSize ? customFontSize : fontSize;
            tooltipTextElement.style.width =
                tooltipWidth > windowWidth ? `${windowWidth - 50}px` : customWidth ? customWidth : width ? width : "225px";
            tooltipTextElement.style.padding = customPadding ? customPadding : padding;
            if (customAnimation) {
                const randomAnimationCssClassName = generateRandomWord(4);
                tooltipTextElement.classList.add(randomAnimationCssClassName);
                tipnixStyleElement.innerHTML += `
          .tipnix:hover .tooltip.${randomAnimationCssClassName} {
            animation: ${customAnimation} 0.5s ease-in-out both;
          }
        `;
            }
            else if (animation) {
                tipnixStyleElement.innerHTML += `
          .tipnix:hover .tooltip {
            animation: ${animation} 0.5s ease-in-out both;
          }
        `;
            }
            else {
                tipnixStyleElement.innerHTML += `
          .tipnix:hover .tooltip {
            animation: shake 0.5s ease-in-out both;
          }
        `;
            }
            tooltipTextElement.textContent = tooltipTextContent || "";
            if (customBackgroundColor) {
                const randomCssClassName = generateRandomWord(4);
                tooltipTextElement.classList.add(randomCssClassName);
                tipnixStyleElement.innerHTML += `
          .tooltip.${randomCssClassName}::before {
            background: ${customBackgroundColor || "#333333"} !important;
          }
        `;
            }
            else {
                tipnixStyleElement.innerHTML += `
          .tooltip::before {
            background: ${backgroundColor || "#333333"} !important;
          }
        `;
            }
            wrapper.append(tooltipTextElement);
            const wrapperWidth = wrapper.offsetWidth / 2;
            let wrapperPosition = 0;
            let parentElement = null;
            if (customParent) {
                parentElement = document.querySelector(customParent);
                wrapperPosition = isRtl
                    ? ((parentElement === null || parentElement === void 0 ? void 0 : parentElement.getBoundingClientRect().right) || 0) - wrapper.getBoundingClientRect().right
                    : wrapper.getBoundingClientRect().left - ((parentElement === null || parentElement === void 0 ? void 0 : parentElement.getBoundingClientRect().left) || 0);
            }
            else if (parentWrapElement) {
                parentElement = document.querySelector(parentWrapElement);
                wrapperPosition = isRtl
                    ? ((parentElement === null || parentElement === void 0 ? void 0 : parentElement.getBoundingClientRect().right) || 0) - wrapper.getBoundingClientRect().right
                    : wrapper.getBoundingClientRect().left - ((parentElement === null || parentElement === void 0 ? void 0 : parentElement.getBoundingClientRect().left) || 0);
            }
            else {
                wrapperPosition = isRtl ? wrapper.getBoundingClientRect().right : wrapper.getBoundingClientRect().left;
            }
            const tooltipContentWidth = tooltipTextElement.offsetWidth;
            const tooltipContentHeight = tooltipTextElement.offsetHeight + 15;
            tooltipTextElement.style.top = -tooltipContentHeight + "px";
            if (wrapperPosition < tooltipContentWidth / 2) {
                if (isRtl) {
                    tooltipTextElement.style.right = -wrapperPosition + "px";
                }
                else {
                    tooltipTextElement.style.left = -wrapperPosition + "px";
                }
                tooltipTextElement.style.transform = "translateX(-0%)";
                if (isRtl) {
                    tooltipTextElement.style.setProperty("--tooltip-before-right", `${wrapperPosition + wrapperWidth - 10}px`);
                    tooltipTextElement.style.setProperty("--tooltip-before-left", `unset`);
                }
                else {
                    tooltipTextElement.style.setProperty("--tooltip-before-left", `${wrapperPosition + wrapperWidth - 2}px`);
                    tooltipTextElement.style.setProperty("--tooltip-before-right", `unset`);
                }
            }
            else {
                tooltipTextElement.style.left = "unset";
                tooltipTextElement.style.transform = "unset";
                tooltipTextElement.style.setProperty("--tooltip-before-left", `50%`);
            }
        });
        // Add event listeners
        const tooltipElements = document.querySelectorAll(".tipnix");
        tooltipElements.forEach((tooltipElement) => {
            tooltipElement.addEventListener("mouseenter", (event) => {
                const element = event.target;
                const tooltipContentElement = element.querySelector(".tooltip");
                if (tooltipContentElement) {
                    tipnixTooltipSetTopPosition(tooltipElement, tooltipContentElement);
                }
            });
        });
        initialized.current = true;
    }, []);
    function tipnixTooltipSetTopPosition(wrapElement, contentElement) {
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
    }
    function generateRandomWord(length = 4) {
        const characters = "abcdefghijklmnopqrstuvwxyz";
        let randomWord = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomWord += characters[randomIndex];
        }
        return randomWord;
    }
    const addTooltipStyles = useCallback(() => {
        if (typeof document === "undefined")
            return;
        const styleElement = document.createElement("style");
        styleElement.id = "tipnix-animations";
        styleElement.innerHTML = `
        .tipnix {
      position: relative;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
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
        
    .tooltip {
      position: absolute;
      width: 225px;
      top: 0;
      left: 50%;
      padding: 10px;
      opacity: 0;
      pointer-events: none;
      transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      background: var(--background);
      z-index: 100;
      border-radius: 8px;
      transform-origin: 0 0;
      text-transform: capitalize;
      font-weight: 400;
      font-size: 16px;
      box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
    }
    
    .tooltip::before {
      position: absolute;
      content: "";
      height: 0.6em;
      width: 0.6em;
      bottom: var(--tooltip-before-bottom, -0.2em);
      top: var(--tooltip-before-top, -0.2em);
      left: var(--tooltip-before-left, 0);
      right: var(--tooltip-before-right, unset);
      transform: translate(-50%) rotate(45deg);
      background: var(--background) !important;
      padding: unset !important;
      white-space: unset;
      border-radius: unset;
      opacity: 1;
    }
    
    .tipnix:hover .tooltip {
      top: -100%;
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      scale: 1;
    }
    
    .tipnix:hover {
      box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
      color: white;
      border-color: transparent;
    }

    .tooltip-above::before {
      top: unset !important;
      bottom: -0.2em !important;
    }

    .tooltip-below::before {
      top: -0.2em !important;
      bottom: unset !important;
    }
    
    @keyframes shake {
      0% {
        rotate: 0;
      }
    
      25% {
        rotate: 7deg;
      }
    
      50% {
        rotate: -7deg;
      }
    
      75% {
        rotate: 1deg;
      }
    
      100% {
        rotate: 0;
      }
    }

    @keyframes bounce {
      0%, 100% {
          transform: translateY(0);
      }
      50% {
          transform: translateY(-10px);
      }
    }

    @keyframes fadeSlideUp {
      0% {
          opacity: 0;
          transform: translateY(10px);
      }
      100% {
          opacity: 1;
          transform: translateY(0);
      }
    }

    @keyframes zoom {
      0% {
          transform: scale(0.8);
      }
      50% {
          transform: scale(1.2);
      }
      100% {
          transform: scale(1);
      }
    }

    @keyframes pulse {
      0%, 100% {
          transform: scale(1);
          opacity: 1;
      }
      50% {
          transform: scale(1.1);
          opacity: 0.8;
      }
    }

    @keyframes flipIn {
      0% {
          transform: rotateX(-90deg);
          opacity: 0;
      }
      100% {
          transform: rotateX(0deg);
          opacity: 1;
      }
    }

    @keyframes slideInLeft {
      0% {
          transform: translateX(-20px);
          opacity: 0;
      }
      100% {
          transform: translateX(0);
          opacity: 1;
      }
    }

    @keyframes swing {
      0% {
          transform: rotate(0deg);
      }
      20% {
          transform: rotate(15deg);
      }
      40% {
          transform: rotate(-10deg);
      }
      60% {
          transform: rotate(5deg);
      }
      80% {
          transform: rotate(-5deg);
      }
      100% {
          transform: rotate(0deg);
      }
    }

    @keyframes fadeInScale {
      0% {
          opacity: 0;
          transform: scale(0.8);
      }
      100% {
          opacity: 1;
          transform: scale(1);
      }
    }

    @keyframes tiltFadeIn {
      0% {
          opacity: 0;
          transform: rotate(-10deg) translateY(10px);
      }
      100% {
          opacity: 1;
          transform: rotate(0deg) translateY(0);
      }
    }
    `;
        document.head.appendChild(styleElement);
        return () => {
            var _a;
            (_a = document.getElementById("tipnix-animations")) === null || _a === void 0 ? void 0 : _a.remove();
        };
    }, []);
    useEffect(() => {
        // Add base styles
        const cleanup = addTooltipStyles();
        // Initialize tooltips with a slight delay to ensure DOM is ready
        const timer = setTimeout(() => {
            initTipNixTooltip(options);
        }, 100);
        // Set up a mutation observer to detect new tooltip elements
        const observer = new MutationObserver((mutations) => {
            let shouldReinitialize = false;
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        if (node instanceof HTMLElement) {
                            if (node.classList.contains("tipnix") || node.querySelector(".tipnix")) {
                                shouldReinitialize = true;
                            }
                        }
                    });
                }
            });
            if (shouldReinitialize) {
                initTipNixTooltip(options);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return () => {
            var _a;
            clearTimeout(timer);
            observer.disconnect();
            if (cleanup)
                cleanup();
            (_a = document.getElementById("tipnix-style")) === null || _a === void 0 ? void 0 : _a.remove();
        };
    }, [options, addTooltipStyles, initTipNixTooltip]);
    return {
        reinitialize: () => initTipNixTooltip(options),
        isInitialized: initialized.current,
    };
}
export function TooltipProvider({ options = {
    textColor: "#ffffff",
    backgroundColor: "#333333",
}, }) {
    useTooltip(options);
    return null;
}
