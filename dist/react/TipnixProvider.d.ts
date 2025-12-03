import React, { PropsWithChildren } from 'react';
import { TipnixOptions } from '../core/type';
export interface TipnixProviderProps extends TipnixOptions {
}
/**
 * Wrap any part of your app that contains .tipnix elements.
 * No custom hooks required for the consumer.
 */
export declare const TipnixProvider: React.FC<PropsWithChildren<TipnixProviderProps>>;
