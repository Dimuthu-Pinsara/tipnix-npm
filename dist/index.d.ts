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
export declare function initTipNixTooltip(options?: TipNixOptions): void;
export declare function getContrastColor(hexColor: string): string;
