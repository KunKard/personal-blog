"use client";

import { useState } from "react";

interface DownloadLink {
  label: string;
  url: string;
}

export function ProjectLinks({ links }: { links: DownloadLink[] }) {
  const [popup, setPopup] = useState<string | null>(null);

  const handleClick = (link: DownloadLink) => {
    if (
      link.url.startsWith("itch-not-ready") ||
      link.url === "#" ||
      link.url === ""
    ) {
      setPopup(`「${link.label}」正在开发中，敬请期待！`);
      return;
    }
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {links.map((link, i) => (
        <button
          key={i}
          onClick={() => handleClick(link)}
          className="block w-full text-center px-4 py-3 border border-border rounded-lg hover:bg-surface transition-colors text-sm cursor-pointer"
        >
          {link.label}
        </button>
      ))}

      {/* Toast-like popup */}
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-surface border border-border rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <p className="text-sm text-center mb-4">{popup}</p>
            <button
              onClick={() => setPopup(null)}
              className="w-full px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </>
  );
}
