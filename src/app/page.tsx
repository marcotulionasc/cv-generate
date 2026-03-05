"use client";

import { useCallback, useEffect, useState } from "react";
import EditorPanel, { type InputMode } from "@/components/editor-panel";
import Header from "@/components/header";
import PreviewPanel from "@/components/preview-panel";
import { cvExemploMd } from "@/lib/parse-md";
import { cvExemplo } from "@/lib/cv-types";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;

  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function getErrorMessage(response: Response): Promise<string> {
  const fallback = `Erro ${response.status}`;
  const payload = await response.json().catch(() => null);

  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof payload.error === "string" &&
    payload.error.trim()
  ) {
    return payload.error;
  }

  return fallback;
}

export default function Home() {
  const [mode, setMode] = useState<InputMode>("markdown");
  const [jsonInput, setJsonInput] = useState(() => JSON.stringify(cvExemplo, null, 2));
  const [mdInput, setMdInput] = useState(cvExemploMd);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  useEffect(() => {
    if (!pdfSuccess) {
      return;
    }

    const timeout = setTimeout(() => setPdfSuccess(false), 3000);
    return () => clearTimeout(timeout);
  }, [pdfSuccess]);

  const generatePreview = useCallback(async () => {
    setError(null);
    setLoadingPreview(true);

    try {
      const payload =
        mode === "markdown" ? { __md: mdInput } : (JSON.parse(jsonInput) as Record<string, unknown>);

      const response = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setPreviewHtml(await response.text());
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : "Erro ao gerar preview");
      setPreviewHtml(null);
    } finally {
      setLoadingPreview(false);
    }
  }, [mode, mdInput, jsonInput]);

  const downloadPdf = useCallback(async () => {
    if (!previewHtml) {
      return;
    }

    setPdfLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: previewHtml }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const blob = await response.blob();
      triggerDownload(blob, "curriculo.pdf");
      setPdfSuccess(true);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : "Erro ao gerar PDF");
    } finally {
      setPdfLoading(false);
    }
  }, [previewHtml]);

  const downloadHtml = useCallback(() => {
    if (!previewHtml) {
      return;
    }

    const blob = new Blob([previewHtml], { type: "text/html;charset=utf-8" });
    triggerDownload(blob, "curriculo.html");
  }, [previewHtml]);

  const handleFileUpload = useCallback(
    (content: string) => {
      if (mode === "markdown") {
        setMdInput(content);
        setError(null);
        return;
      }

      try {
        JSON.parse(content);
        setJsonInput(content);
        setError(null);
      } catch {
        setError("Arquivo JSON inválido.");
      }
    },
    [mode],
  );

  const inputValue = mode === "markdown" ? mdInput : jsonInput;
  const setInputValue = mode === "markdown" ? setMdInput : setJsonInput;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header
        previewHtml={previewHtml}
        downloadHtml={downloadHtml}
        downloadPdf={downloadPdf}
        pdfLoading={pdfLoading}
        pdfSuccess={pdfSuccess}
      />

      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-0 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:gap-6">
        <EditorPanel
          mode={mode}
          inputValue={inputValue}
          error={error}
          onModeChange={setMode}
          onInputChange={setInputValue}
          onFileUpload={handleFileUpload}
        />

        <PreviewPanel
          previewHtml={previewHtml}
          loadingPreview={loadingPreview}
          onGeneratePreview={generatePreview}
        />
      </main>

      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-400">
        Powered by <span className="font-semibold text-slate-600">Leva Code</span>
      </footer>
    </div>
  );
}
