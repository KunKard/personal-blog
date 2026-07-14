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
  );
}
