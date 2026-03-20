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
export declare function initTipNixTooltip(options?: TipNixOptions): void;
export declare function getContrastColor(hexColor: string): string;
