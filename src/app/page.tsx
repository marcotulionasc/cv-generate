"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { cvExemplo } from "@/lib/cv-types";
import { cvExemploMd } from "@/lib/parse-md";

type InputMode = "json" | "markdown";

function FileUploadZone({ onFile }: { onFile: (content: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => onFile(e.target?.result as string);
    reader.readAsText(file, "utf-8");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-3 text-sm transition-colors ${
        dragging
          ? "border-violet-400 bg-violet-50 text-violet-700"
          : "border-slate-300 bg-slate-50 text-slate-500 hover:border-slate-400 hover:bg-slate-100"
      }`}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
      <span>Soltar arquivo ou <span className="font-medium text-violet-600">escolher</span></span>
      <input
        ref={inputRef}
        type="file"
        accept=".md,.json,.txt"
        className="sr-only"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
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

  // clear success badge after 3s
  useEffect(() => {
    if (!pdfSuccess) return;
    const t = setTimeout(() => setPdfSuccess(false), 3000);
    return () => clearTimeout(t);
  }, [pdfSuccess]);

  const generatePreview = useCallback(async () => {
    setError(null);
    setLoadingPreview(true);
    try {
      let body: string;
      let headers: Record<string, string>;

      if (mode === "markdown") {
        body = JSON.stringify({ __md: mdInput });
        headers = { "Content-Type": "application/json" };
      } else {
        body = jsonInput;
        headers = { "Content-Type": "application/json" };
        JSON.parse(jsonInput); // validate
      }

      const res = await fetch("/api/render", { method: "POST", headers, body });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erro ${res.status}`);
      }
      setPreviewHtml(await res.text());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar preview");
      setPreviewHtml(null);
    } finally {
      setLoadingPreview(false);
    }
  }, [mode, mdInput, jsonInput]);

  const downloadPdf = useCallback(async () => {
    if (!previewHtml) return;
    setPdfLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: previewHtml }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erro ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "curriculo.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setPdfSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar PDF");
    } finally {
      setPdfLoading(false);
    }
  }, [previewHtml]);

  const downloadHtml = useCallback(() => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "curriculo.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [previewHtml]);

  const handleFileUpload = useCallback(
    (content: string) => {
      try {
        if (mode === "json") {
          JSON.parse(content);
          setJsonInput(content);
        } else {
          setMdInput(content);
        }
        setError(null);
      } catch {
        setError("Arquivo JSON inválido.");
      }
    },
    [mode]
  );

  const currentInput = mode === "markdown" ? mdInput : jsonInput;
  const setCurrentInput = mode === "markdown" ? setMdInput : setJsonInput;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600 text-white text-xs font-bold">CV</span>
              <h1 className="text-lg font-bold tracking-tight">Gerador de CV</h1>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              Escreva em Markdown ou JSON · Preview instantâneo · PDF via Puppeteer
            </p>
          </div>

          {previewHtml && (
            <div className="flex items-center gap-2">
              <button
                onClick={downloadHtml}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Baixar HTML
              </button>
              <button
                onClick={downloadPdf}
                disabled={pdfLoading}
                className="relative flex items-center gap-1.5 rounded-md bg-violet-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-violet-700 disabled:opacity-60"
              >
                {pdfLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Gerando PDF…
                  </>
                ) : pdfSuccess ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Baixado!
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Baixar PDF
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-0 px-4 py-6 sm:px-6 lg:grid-cols-2 lg:gap-6">
        {/* Left: Editor */}
        <section className="flex flex-col gap-3">
          {/* Mode tabs + actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
              {(["markdown", "json"] as InputMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                    mode === m
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {m === "markdown" ? "Markdown" : "JSON"}
                </button>
              ))}
            </div>
            <button
              onClick={generatePreview}
              disabled={loadingPreview}
              className="flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
            >
              {loadingPreview ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Gerando…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Gerar preview
                </>
              )}
            </button>
          </div>

          {/* File upload */}
          <FileUploadZone onFile={handleFileUpload} />

          {/* Hint */}
          <p className="text-xs text-slate-400">
            {mode === "markdown"
              ? "Escreva seu CV em Markdown. Use # Nome, ## Experiência, ## Formação, etc."
              : "Cole ou edite o JSON com os dados do currículo."}
          </p>

          {/* Textarea */}
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            className="min-h-[520px] w-full flex-1 rounded-lg border border-slate-200 bg-white p-3 font-mono text-sm text-slate-800 shadow-inner focus:border-violet-400 focus:outline-none focus:ring-1 focus:ring-violet-400"
            placeholder={mode === "markdown" ? "# Seu Nome\n> Título\n\n**Email:** ..." : '{"nome": "...", "email": "..."}'}
            spellCheck={false}
          />

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {error}
            </div>
          )}

          {/* Format guide */}
          {mode === "markdown" && (
            <details className="rounded-lg border border-slate-200 bg-white text-xs text-slate-500 shadow-sm">
              <summary className="cursor-pointer px-3 py-2 font-medium text-slate-600 select-none">
                Formato do Markdown
              </summary>
              <pre className="overflow-x-auto px-3 pb-3 leading-relaxed">{`# Nome Completo
> Título Profissional

**Email:** email@exemplo.com | **Telefone:** +55 11 99999-9999
**Localização:** São Paulo, SP | **LinkedIn:** linkedin.com/in/voce
**GitHub:** github.com/voce

## Resumo
Texto do resumo aqui.

## Experiência
### Cargo @ Empresa
_2022 - Presente | Cidade, UF_
Descrição do cargo.
- Conquista 1
- Conquista 2

## Formação
### Nome do Curso
_Instituição · 2016 - 2020_

## Habilidades
React, TypeScript, Node.js, PostgreSQL

## Idiomas
- Português: Nativo
- Inglês: Fluente

## Projetos
### Nome do Projeto
Descrição breve.
Technologies: React, TypeScript
[Ver projeto](https://link.com)

## Certificações
- Nome do Cert · Emissor (2023)`}</pre>
            </details>
          )}
        </section>

        {/* Right: Preview */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Preview</h2>
            {previewHtml && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Pronto
              </span>
            )}
          </div>

          <div className="min-h-[600px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner">
            {previewHtml ? (
              <iframe
                title="Preview do currículo"
                srcDoc={previewHtml}
                className="h-full min-h-[600px] w-full border-0"
                sandbox="allow-same-origin"
              />
            ) : (
              <div className="flex h-full min-h-[600px] flex-col items-center justify-center gap-3 text-slate-300">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-400">Nenhum preview gerado</p>
                  <p className="text-xs text-slate-300">Clique em &quot;Gerar preview&quot; para ver o CV aqui</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-400">
        PDF gerado server-side com Puppeteer · Template .hbs customizável em{" "}
        <code className="rounded bg-slate-100 px-1">src/templates/default.hbs</code>
      </footer>
    </div>
  );
}
