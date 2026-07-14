"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface MarkdownContentProps {
  content: string;
}

function preprocessMarkdown(raw: string): string {
  return (
    raw
      // Fix list items: "-文字" → "- 文字" (add space after dash for markdown list syntax)
      .replace(/^(-)([^\s\d\-*+])/gm, "$1 $2")
      // Ensure blank line before headings for proper paragraph breaks
      .replace(/\n(#{1,6}\s)/g, "\n\n$1")
      // Normalize triple+ newlines to double
      .replace(/\n{3,}/g, "\n\n")
  );
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) {
    return <p className="text-muted">暂无内容</p>;
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1: ({ children, ...props }) => (
            <h1 className="text-2xl font-bold mt-8 mb-4" {...props}>{children}</h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-xl font-bold mt-6 mb-3" {...props}>{children}</h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-semibold mt-5 mb-2" {...props}>{children}</h3>
          ),
          p: ({ children, ...props }) => (
            <p className="text-base leading-relaxed mb-4 text-foreground/85" {...props}>{children}</p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/85" {...props}>{children}</ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-1 text-foreground/85" {...props}>{children}</ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-base" {...props}>{children}</li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-border pl-4 italic text-muted mb-4" {...props}>{children}</blockquote>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 bg-surface text-sm rounded font-mono text-foreground/80" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-surface p-4 rounded-lg overflow-x-auto mb-4 border border-border">
                <code className="text-sm font-mono text-foreground/80" {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          pre: ({ children, ...props }) => (
            <pre className="bg-surface p-4 rounded-lg overflow-x-auto mb-4 border border-border" {...props}>{children}</pre>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href as string}
              className="text-foreground underline underline-offset-2 hover:text-foreground/70 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          img: ({ src, alt, ...props }) => (
            <img
              src={src as string}
              alt={alt as string}
              className="rounded-lg border border-border max-w-full my-4"
              {...props}
            />
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-border rounded-lg" {...props}>{children}</table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="px-4 py-2 bg-surface border-b border-border text-left text-sm font-medium" {...props}>{children}</th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-2 border-b border-border text-sm" {...props}>{children}</td>
          ),
          hr: (props) => (
            <hr className="my-8 border-border" {...props} />
          ),
        }}
      >
        {preprocessMarkdown(content)}
      </ReactMarkdown>
    </div>
  );
}
