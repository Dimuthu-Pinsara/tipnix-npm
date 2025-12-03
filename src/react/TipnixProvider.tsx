// src/react/TipnixProvider.tsx
'use client';

import React, { PropsWithChildren, useEffect } from 'react';
import { initTipnixTooltip } from '../core/tipnix';
import { TipnixOptions } from '../core/type';

export interface TipnixProviderProps extends TipnixOptions {}

/**
 * Wrap any part of your app that contains .tipnix elements.
 * No custom hooks required for the consumer.
 */
export const TipnixProvider: React.FC<PropsWithChildren<TipnixProviderProps>> = ({
  children,
  ...options
}) => {
  useEffect(() => {
    // Call once on mount (and on options change)
    initTipnixTooltip(options);
  }, [JSON.stringify(options)]); // simple, cheap dependency for now

  return <>{children}</>;
};
