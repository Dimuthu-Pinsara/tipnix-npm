import React, { useEffect, ReactNode } from 'react';
import { initTipNixTooltip, TooltipOptions } from '../utils/initTooltip';

interface TooltipProps {
    children: ReactNode;
    options?: TooltipOptions;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, options = {} }) => {
    useEffect(() => {
        initTipNixTooltip(options);
    }, [options]);

    return <>{children}</>;
};
