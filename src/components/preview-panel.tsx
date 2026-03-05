"use client";

interface PreviewPanelProps {
  previewHtml: string | null;
  loadingPreview: boolean;
  onGeneratePreview: () => void;
}

export default function PreviewPanel({
  previewHtml,
  loadingPreview,
  onGeneratePreview,
}: PreviewPanelProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Preview</h2>
        <div className="flex items-center gap-2">
          {previewHtml && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Pronto
            </span>
          )}
          <button
            type="button"
            onClick={onGeneratePreview}
            disabled={loadingPreview}
            className="flex items-center gap-1.5 rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
          >
            {loadingPreview ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Gerando…
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {previewHtml ? "Atualizar preview" : "Gerar preview"}
              </>
            )}
          </button>
        </div>
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-400">Nenhum preview gerado</p>
              <p className="text-xs text-slate-300">
                Clique em &quot;Gerar preview&quot; para ver o CV aqui
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
