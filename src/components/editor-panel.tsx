"use client";

import FileUploadZone from "@/components/file-upload-zone";

export type InputMode = "json" | "markdown";

interface EditorPanelProps {
  mode: InputMode;
  inputValue: string;
  error: string | null;
  onModeChange: (mode: InputMode) => void;
  onInputChange: (value: string) => void;
  onFileUpload: (content: string) => void;
}

const INPUT_MODES: InputMode[] = ["markdown", "json"];

const MARKDOWN_FORMAT_GUIDE = `# Nome Completo
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
- Nome do Cert · Emissor (2023)`;

export default function EditorPanel({
  mode,
  inputValue,
  error,
  onModeChange,
  onInputChange,
  onFileUpload,
}: EditorPanelProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-2">
        <div className="flex">
          {INPUT_MODES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onModeChange(option)}
              className={`relative select-none px-5 py-2 text-sm font-medium transition-colors ${
                mode === option
                  ? "-mb-px z-10 rounded-t-lg border border-b-white border-slate-200 bg-white text-violet-600"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {option === "markdown" ? "📝 .md" : "{ } JSON"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">Importe um arquivo para preencher o editor rapidamente.</p>
        <FileUploadZone onFile={onFileUpload} compact />
      </div>

      <div className="rounded-b-lg rounded-tr-lg border border-slate-200 bg-white shadow-sm">
        <textarea
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          className="min-h-[540px] w-full resize-none rounded-b-lg rounded-tr-lg bg-white p-4 font-mono text-sm text-slate-800 focus:outline-none"
          placeholder={
            mode === "markdown" ? "# Seu Nome\n> Título\n\n**Email:** ..." : '{"nome": "...", "email": "..."}'
          }
          spellCheck={false}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          {error}
        </div>
      )}

      {mode === "markdown" && (
        <details className="rounded-lg border border-slate-200 bg-white text-xs text-slate-500 shadow-sm">
          <summary className="cursor-pointer select-none px-3 py-2 font-medium text-slate-600">
            Ver formato do .md
          </summary>
          <pre className="overflow-x-auto px-3 pb-3 leading-relaxed">{MARKDOWN_FORMAT_GUIDE}</pre>
        </details>
      )}
    </section>
  );
}
