"use client";

import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "Upload Image",
  className = "",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a JPG, PNG, WebP, or GIF image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed. Please try again.");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
  }

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-charcoal">
          {label}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        id={`upload-${label.replace(/\s/g, "-").toLowerCase()}`}
      />

      {value ? (
        <div className="relative group">
          <div className="relative w-full max-w-sm overflow-hidden rounded-lg border border-sand bg-ivory">
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-auto max-h-64 object-contain"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="px-3 py-1.5 text-xs bg-white text-charcoal rounded hover:bg-ivory transition-colors"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1.5 text-xs bg-white text-error rounded hover:bg-ivory transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={`upload-${label.replace(/\s/g, "-").toLowerCase()}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex items-center justify-center w-full h-24 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer ${
            dragOver
              ? "border-accent bg-accent/5"
              : "border-sand bg-ivory hover:border-stone hover:bg-cream"
          }`}
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="text-accent animate-spin" />
              <span className="text-xs text-muted">Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload size={16} className="text-stone" />
              <span className="text-xs text-muted">Upload image</span>
            </div>
          )}
        </label>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-error">{error}</p>
      )}
    </div>
  );
}
