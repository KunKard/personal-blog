"use client";

import { useMemo } from "react";
import * as jsxRuntime from "react/jsx-runtime";

interface MDXRendererProps {
  code: string;
}

/**
 * Renders compiled MDX code from Velite at runtime.
 * The code string is the compiled MDX output that works with the React JSX runtime.
 */
export function MDXRenderer({ code }: MDXRendererProps) {
  const Content = useMemo(() => {
    try {
      // The Velite-compiled MDX code expects jsxRuntime as arguments[0]
      const result = new Function(code)(jsxRuntime);
      return result.default;
    } catch (e) {
      console.error("Failed to compile MDX:", e);
      return () => null;
    }
  }, [code]);

  return <Content />;
}
