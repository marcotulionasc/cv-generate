"use client";

import { useRef, useState } from "react";

interface FileUploadZoneProps {
  onFile: (content: string) => void;
  compact?: boolean;
}

export default function FileUploadZone({
  onFile,
  compact = false,
}: FileUploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const content = await file.text();
    onFile(content);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);

        const file = event.dataTransfer.files[0];
        if (file) {
          void handleFile(file).catch((error) => {
            console.error("Erro ao ler arquivo:", error);
          });
        }
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors ${
        dragging
          ? "border-violet-400 bg-violet-50 text-violet-700"
          : "border-slate-300 bg-slate-50 text-slate-500 hover:border-slate-400 hover:bg-slate-100"
      } ${
        compact ? "min-h-0 flex-row gap-2 px-3 py-1.5 text-xs" : ""
      }`}
    >
      <svg
        className={compact ? "h-4 w-4" : "h-5 w-5"}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
      <span>
        {compact ? (
          <>
            Importar <span className="font-medium text-violet-600">arquivo</span>
          </>
        ) : (
          <>
            Soltar arquivo ou{" "}
            <span className="font-medium text-violet-600">escolher</span>
          </>
        )}
      </span>
      <input
        ref={inputRef}
        type="file"
        accept=".md,.json,.txt"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void handleFile(file).catch((error) => {
              console.error("Erro ao ler arquivo:", error);
            });
          }
        }}
      />
    </div>
  );
}
