// src/react/TipnixProvider.tsx
'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { initTipnixTooltip } from '../core/tipnix';
/**
 * Wrap any part of your app that contains .tipnix elements.
 * No custom hooks required for the consumer.
 */
export const TipnixProvider = (_a) => {
    var { children } = _a, options = __rest(_a, ["children"]);
    useEffect(() => {
        // Call once on mount (and on options change)
        initTipnixTooltip(options);
    }, [JSON.stringify(options)]); // simple, cheap dependency for now
    return _jsx(_Fragment, { children: children });
};
