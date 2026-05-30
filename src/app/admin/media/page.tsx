"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

export default function AdminMediaPage() {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ id: string; publicUrl: string }[]>([]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setResults((prev) => [...prev, data]);
      }
      setUploading(false);
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setResults((prev) => [...prev, data]);
      }
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">媒体库</h1>

      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-border rounded-lg p-12 text-center mb-8 hover:border-primary/50 transition-colors"
      >
        <p className="text-4xl mb-4">📁</p>
        <p className="text-muted mb-2">拖放文件到此处上传</p>
        <p className="text-xs text-muted mb-4">或</p>
        <label>
          <Button variant="outline" disabled={uploading} onClick={() => {}}>
            {uploading ? "上传中..." : "选择文件"}
          </Button>
          <input type="file" className="hidden" onChange={handleFileSelect} multiple accept="image/*" />
        </label>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">已上传</h2>
          <div className="grid grid-cols-4 gap-4">
            {results.map((r, i) => (
              <div key={i} className="bg-surface border border-border rounded-lg p-3">
                <img src={r.publicUrl} alt="" className="aspect-square object-cover rounded mb-2" />
                <input
                  type="text"
                  value={r.publicUrl}
                  readOnly
                  className="w-full text-xs bg-background border border-border rounded p-1.5"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
