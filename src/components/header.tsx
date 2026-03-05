interface HeaderProps {
  previewHtml: string | null;
  downloadHtml: () => void;
  downloadPdf: () => void;
  pdfLoading: boolean;
  pdfSuccess: boolean;
}

export default function Header({
  previewHtml,
  downloadHtml,
  downloadPdf,
  pdfLoading,
  pdfSuccess,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600 text-white text-xs font-bold">
              CV
            </span>
            <h1 className="text-lg font-bold tracking-tight">Gerador de CV</h1>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Escreva em Markdown ou JSON · Preview instantâneo · PDF via
            Puppeteer
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
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Gerando PDF…
                </>
              ) : pdfSuccess ? (
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Baixado!
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  Baixar PDF
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
