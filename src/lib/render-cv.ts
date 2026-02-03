import Handlebars from "handlebars";
import { readFileSync } from "fs";
import { join } from "path";
import type { CVData, HabilidadeCategoria } from "./cv-types";

/** Normaliza os dados do CV para o template (ex.: habilidades em lista vs categorias) */
function normalizeCvData(data: CVData): Record<string, unknown> {
  const out: Record<string, unknown> = { ...data };

  if (Array.isArray(data.habilidades) && data.habilidades.length > 0) {
    const first = data.habilidades[0];
    if (typeof first === "string") {
      out.habilidadesLista = data.habilidades;
      out.habilidadesCategorias = undefined;
    } else {
      out.habilidadesLista = undefined;
      out.habilidadesCategorias = data.habilidades as HabilidadeCategoria[];
    }
  } else {
    out.habilidadesLista = undefined;
    out.habilidadesCategorias = undefined;
  }

  return out;
}

let cachedTemplate: Handlebars.TemplateDelegate | null = null;

function getTemplate(): Handlebars.TemplateDelegate {
  if (cachedTemplate) return cachedTemplate;
  const templatePath = join(process.cwd(), "src/templates/default.hbs");
  const source = readFileSync(templatePath, "utf-8");
  cachedTemplate = Handlebars.compile(source);
  return cachedTemplate;
}

/**
 * Renderiza o currículo em HTML a partir dos dados e do template default.hbs.
 */
export function renderCv(data: CVData): string {
  const template = getTemplate();
  const normalized = normalizeCvData(data);
  return template(normalized);
}

/**
 * Renderiza com um template customizado (string).
 * Útil para quando o usuário editar o template na UI.
 */
export function renderCvWithSource(data: CVData, templateSource: string): string {
  const normalized = normalizeCvData(data);
  const template = Handlebars.compile(templateSource);
  return template(normalized);
}
