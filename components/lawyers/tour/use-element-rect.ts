"use client";

import { useState, useEffect, useCallback } from "react";

export interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

/**
 * Measures and tracks the bounding rect of a DOM element identified by a data-tour attribute.
 * Handles scroll, resize, and DOM changes.
 */
export function useElementRect(target: string | null): ElementRect | null {
  const [rect, setRect] = useState<ElementRect | null>(null);

  const measure = useCallback(() => {
    if (!target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${target}"]`);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
      bottom: r.bottom,
      right: r.right,
    });
  }, [target]);

  useEffect(() => {
    measure();

    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    const observer = new MutationObserver(measure);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "data-state"],
    });

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      observer.disconnect();
    };
  }, [measure]);

  return rect;
}
