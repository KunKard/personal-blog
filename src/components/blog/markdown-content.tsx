"use client";

interface MarkdownContentProps {
  content: string;
}

/**
 * 简易 Markdown 渲染组件（不依赖外部包）
 * 用于静态导出构建，避免 react-markdown 依赖问题
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) {
    return <p className="text-muted">暂无内容</p>;
  }

  // 简易渲染：将 Markdown 转为纯文本展示
  // 等网站正式上线后可恢复完整的 react-markdown 渲染
  const plainText = content
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/```[\s\S]*?```/g, "[代码块]")
    .replace(/`(.+?)`/g, "$1")
    .replace(/[-*+]\s/g, "• ")
    .trim();

  const paragraphs = plainText.split(/\n{2,}/);

  return (
    <div className="markdown-body">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-base leading-relaxed mb-4 text-foreground/85"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
