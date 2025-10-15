interface TooltipOptions {
    textColor?: string;
    backgroundColor?: string;
    fontSize?: string;
    animation?: string;
    width?: string;
    padding?: string;
    parentWrapElement?: string;
}
export declare function useTooltip(options?: TooltipOptions): {
    reinitialize: () => void;
    isInitialized: boolean;
};
export declare function TooltipProvider({ options, }: {
    options?: TooltipOptions;
}): null;
export {};
