"use client";

import { useState, useCallback, useRef } from "react";
import { cvExemplo } from "@/lib/cv-types";

export default function Home() {
  const [jsonInput, setJsonInput] = useState(() =>
    JSON.stringify(cvExemplo, null, 2)
  );
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const loadExample = useCallback(() => {
    setJsonInput(JSON.stringify(cvExemplo, null, 2));
    setError(null);
  }, []);

  const generatePreview = useCallback(async () => {
    setError(null);
    try {
      const data = JSON.parse(jsonInput);
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erro ${res.status}`);
      }
      const html = await res.text();
      setPreviewHtml(html);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao gerar preview");
      setPreviewHtml(null);
    }
  }, [jsonInput]);

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

  const downloadPdf = useCallback(async () => {
    if (!previewHtml) return;
    setPdfLoading(true);
    setError(null);
    const blobUrl = URL.createObjectURL(
      new Blob([previewHtml], { type: "text/html;charset=utf-8" })
    );
    const tempIframe = document.createElement("iframe");
    tempIframe.setAttribute("style", "position:absolute;width:0;height:0;border:0;visibility:hidden");
    tempIframe.sandbox.add("allow-same-origin");
    document.body.appendChild(tempIframe);
    try {
      await new Promise<void>((resolve, reject) => {
        tempIframe.onload = () => resolve();
        tempIframe.onerror = () => reject(new Error("Falha ao carregar o documento"));
        tempIframe.src = blobUrl;
      });
      await new Promise((r) => setTimeout(r, 500));
      const doc = tempIframe.contentDocument;
      const element = doc?.querySelector(".cv-article") ?? doc?.body;
      if (!element) throw new Error("Preview não disponível");
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: 10,
          filename: "curriculo.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erro ao gerar PDF. Tente novamente."
      );
    } finally {
      URL.revokeObjectURL(blobUrl);
      tempIframe.remove();
      setPdfLoading(false);
    }
  }, [previewHtml]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Gerador de CV
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Edite o JSON com seus dados e use o template .hbs para um currículo
            profissional com Tailwind CSS.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editor JSON */}
          <section className="flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Dados do currículo (JSON)
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={loadExample}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Carregar exemplo
                </button>
                <button
                  type="button"
                  onClick={generatePreview}
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                >
                  Gerar preview
                </button>
              </div>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="mt-2 min-h-[480px] w-full rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800 shadow-inner focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              placeholder='{"nome": "...", "email": "..."}'
              spellCheck={false}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </section>

          {/* Preview */}
          <section className="flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Preview
              </h2>
              {previewHtml && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={downloadPdf}
                    disabled={pdfLoading}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {pdfLoading ? "Gerando…" : "Baixar PDF"}
                  </button>
                  <button
                    type="button"
                    onClick={downloadHtml}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    Baixar HTML
                  </button>
                </div>
              )}
            </div>
            <div className="mt-2 min-h-[480px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner">
              {previewHtml ? (
                <iframe
                  ref={iframeRef}
                  title="Preview do currículo"
                  srcDoc={previewHtml}
                  className="h-full min-h-[520px] w-full border-0"
                  sandbox="allow-same-origin"
                />
              ) : (
                <div className="flex h-full min-h-[520px] flex-col items-center justify-center gap-2 text-slate-400">
                  <p className="text-sm">Clique em &quot;Gerar preview&quot;</p>
                  <p className="text-xs">para ver o currículo aqui.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <p>
            <strong>Como usar:</strong> Edite o JSON à esquerda com seus dados
            (nome, email, experiências, formação, habilidades, etc.). O template
            está em <code className="rounded bg-slate-100 px-1">src/templates/default.hbs</code>.
            Consulte o arquivo{" "}
            <code className="rounded bg-slate-100 px-1">TEMPLATE_SINTAXE.md</code>{" "}
            para saber como escrever seu próprio template em .hbs.
          </p>
        </div>
      </main>
    </div>
  );
}
