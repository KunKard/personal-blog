/** Preprocess raw markdown content to fix common formatting issues */
export function preprocessMarkdown(raw: string): string {
  return (
    raw
      // Fix list items: "-文字" → "- 文字" (add space after dash for markdown list syntax)
      .replace(/^(-)([^\s\d\-*+])/gm, "$1 $2")
      // Also fix "*文字" → "* 文字" and "+文字" → "+ 文字"
      .replace(/^([*+])([^\s\d\-*+])/gm, "$1 $2")
      // Ensure blank line before headings for proper paragraph breaks
      .replace(/\n(#{1,6}\s)/g, "\n\n$1")
      // Normalize triple+ newlines to double
      .replace(/\n{3,}/g, "\n\n")
      // Escape angle brackets in generics like <GameObject> to prevent React from treating them as HTML tags
      // Only escape when inside inline code, code blocks, or followed by an uppercase letter (C# generics pattern)
      .replace(/<([A-Z][A-Za-z0-9_]*)>/g, "&lt;$1&gt;")
      .replace(/<\/([A-Z][A-Za-z0-9_]*)>/g, "&lt;/$1&gt;")
  );
}
