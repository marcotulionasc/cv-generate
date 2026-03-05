import type {
  CVData,
  Experiencia,
  Formacao,
  HabilidadeCategoria,
  Idioma,
  Projeto,
  Certificacao,
} from "./cv-types";

function splitIntoSections(md: string): Map<string, string> {
  const sections = new Map<string, string>();
  const lines = md.split("\n");
  let currentSection = "__header__";
  let buffer: string[] = [];

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)/);
    if (h2Match) {
      sections.set(currentSection, buffer.join("\n").trim());
      currentSection = h2Match[1].toLowerCase().trim();
      buffer = [];
    } else {
      buffer.push(line);
    }
  }
  sections.set(currentSection, buffer.join("\n").trim());
  return sections;
}

function parseHeader(headerText: string): Partial<CVData> {
  const lines = headerText.split("\n").map((l) => l.trim()).filter(Boolean);
  const result: Partial<CVData> = {};

  for (const line of lines) {
    const nameMatch = line.match(/^#\s+(.+)/);
    if (nameMatch) { result.nome = nameMatch[1].trim(); continue; }

    const titleMatch = line.match(/^>\s+(.+)/);
    if (titleMatch) { result.titulo = titleMatch[1].trim(); continue; }

    const kvMatches = [...line.matchAll(/\*\*([^*]+):\*\*\s*([^|*\n]+)/g)];
    for (const match of kvMatches) {
      const key = match[1].toLowerCase().trim();
      const value = match[2].trim();
      if (key === "email") result.email = value;
      else if (["phone", "telefone", "tel"].includes(key)) result.telefone = value;
      else if (["location", "localizacao", "localização"].includes(key)) result.localizacao = value;
      else if (key === "linkedin") result.linkedin = value;
      else if (key === "github") result.github = value;
      else if (["website", "site"].includes(key)) result.website = value;
    }
  }
  return result;
}

function parseExperience(text: string): Experiencia[] {
  const items: Experiencia[] = [];
  const blocks = text.split(/\n(?=###\s)/);

  for (const block of blocks) {
    const lines = block.split("\n");
    const titleLine = lines.shift();
    if (!titleLine?.startsWith("###")) continue;

    const titleText = titleLine.replace(/^###\s+/, "").trim();
    let cargo = titleText;
    let empresa = "";

    const atMatch = titleText.match(/^(.+?)\s+@\s+(.+)$/);
    const slashMatch = titleText.match(/^(.+?)\s+\/\s+(.+)$/);
    if (atMatch) { cargo = atMatch[1].trim(); empresa = atMatch[2].trim(); }
    else if (slashMatch) { empresa = slashMatch[1].trim(); cargo = slashMatch[2].trim(); }

    let periodo = "";
    let local = "";
    const metaLine = lines.find((l) => l.trim().startsWith("_"));
    if (metaLine) {
      const meta = metaLine.replace(/_/g, "").trim();
      const parts = meta.split("|").map((p) => p.trim());
      periodo = parts[0] || "";
      local = parts[1] || "";
    }

    const conquistas: string[] = [];
    const descLines: string[] = [];
    for (const line of lines) {
      const t = line.trim();
      if (t.startsWith("- ") || t.startsWith("* ")) conquistas.push(t.replace(/^[-*]\s+/, ""));
      else if (t && !t.startsWith("_")) descLines.push(t);
    }

    items.push({
      empresa,
      cargo,
      periodo,
      ...(local && { local }),
      ...(descLines.length && { descricao: descLines.join(" ") }),
      ...(conquistas.length && { conquistas }),
    });
  }
  return items;
}

function parseEducation(text: string): Formacao[] {
  const items: Formacao[] = [];
  const blocks = text.split(/\n(?=###\s)/);

  for (const block of blocks) {
    const lines = block.split("\n");
    const titleLine = lines.shift();
    if (!titleLine?.startsWith("###")) continue;

    const curso = titleLine.replace(/^###\s+/, "").trim();
    let instituicao = "";
    let periodo = "";

    const metaLine = lines.find((l) => l.trim().startsWith("_"));
    if (metaLine) {
      const meta = metaLine.replace(/_/g, "").trim();
      const parts = meta.split("\u00b7").map((p) => p.trim());
      instituicao = parts[0] || "";
      periodo = parts[1] || "";
    }

    const descLines = lines.filter((l) => l.trim() && !l.trim().startsWith("_"));
    items.push({
      curso,
      instituicao,
      periodo,
      ...(descLines.length && { descricao: descLines.join(" ").trim() }),
    });
  }
  return items;
}

function parseSkills(text: string): string[] | HabilidadeCategoria[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const hasCats = lines.some((l) => /^\*\*[^*]+:\*\*/.test(l));

  if (hasCats) {
    return lines
      .map((l) => {
        const m = l.match(/^\*\*([^*]+):\*\*\s*(.+)/);
        return m
          ? { categoria: m[1].trim(), itens: m[2].split(",").map((s) => s.trim()).filter(Boolean) }
          : null;
      })
      .filter(Boolean) as HabilidadeCategoria[];
  }

  const allText = lines.join("\n");
  if (allText.includes(",") && !allText.includes("\n- ")) {
    return allText.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return lines.map((l) => l.replace(/^[-*]\s+/, "").trim()).filter(Boolean);
}

function parseLanguages(text: string): Idioma[] {
  return text
    .split("\n")
    .map((l) => l.trim().replace(/^[-*]\s+/, ""))
    .filter(Boolean)
    .map((l) => {
      const parts = l.split(/[:\-\u2014]/).map((p) => p.trim());
      return { idioma: parts[0], nivel: parts[1] || "" };
    })
    .filter((l) => l.idioma);
}

function parseProjects(text: string): Projeto[] {
  const projects: Projeto[] = [];
  const blocks = text.split(/\n(?=###\s)/);

  for (const block of blocks) {
    const lines = block.split("\n");
    const titleLine = lines.shift();
    if (!titleLine?.startsWith("###")) continue;

    const nome = titleLine.replace(/^###\s+/, "").trim();
    let link = "";
    const descParts: string[] = [];
    let tecnologias: string[] = [];

    for (const line of lines) {
      const t = line.trim();
      const linkMatch = t.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) { link = linkMatch[2]; continue; }
      const techMatch = t.match(/^(?:technologies|tecnologias|tech|stack)[:\s]+(.+)/i);
      if (techMatch) { tecnologias = techMatch[1].split(",").map((s) => s.trim()).filter(Boolean); continue; }
      if (t) descParts.push(t);
    }

    projects.push({
      nome,
      ...(descParts.length && { descricao: descParts.join(" ").trim() }),
      ...(link && { link }),
      ...(tecnologias.length && { tecnologias }),
    });
  }
  return projects;
}

function parseCertifications(text: string): Certificacao[] {
  return text
    .split("\n")
    .map((l) => l.trim().replace(/^[-*]\s+/, ""))
    .filter(Boolean)
    .map((l) => {
      const yearMatch = l.match(/\((\d{4})\)/);
      const ano = yearMatch?.[1];
      const withoutYear = l.replace(/\s*\(\d{4}\)/, "").trim();
      const parts = withoutYear.split("\u00b7").map((p) => p.trim());
      return {
        nome: parts[0],
        ...(parts[1] && { emissor: parts[1] }),
        ...(ano && { ano }),
      };
    });
}

const SECTION_ALIASES: Record<string, string> = {
  summary: "resumo",
  resumo: "resumo",
  sobre: "resumo",
  experience: "experiencias",
  "experiência": "experiencias",
  experiencia: "experiencias",
  "work experience": "experiencias",
  "professional experience": "experiencias",
  "experiência profissional": "experiencias",
  "experiencia profissional": "experiencias",
  education: "formacao",
  "formação": "formacao",
  formacao: "formacao",
  skills: "habilidades",
  habilidades: "habilidades",
  languages: "idiomas",
  idiomas: "idiomas",
  projects: "projetos",
  projetos: "projetos",
  certifications: "certificacoes",
  "certificações": "certificacoes",
  certificacoes: "certificacoes",
};

export function parseMdToCv(md: string): CVData {
  const sections = splitIntoSections(md);
  const header = parseHeader(sections.get("__header__") || "");

  const result: CVData = {
    nome: header.nome || "",
    email: header.email || "",
    ...header,
    experiencias: [],
    formacao: [],
    habilidades: [],
  };

  for (const [sectionTitle, content] of sections) {
    if (!content) continue;
    const normalized = SECTION_ALIASES[sectionTitle] ?? sectionTitle;

    if (normalized === "resumo") result.resumo = content;
    else if (normalized === "experiencias") result.experiencias = parseExperience(content);
    else if (normalized === "formacao") result.formacao = parseEducation(content);
    else if (normalized === "habilidades") result.habilidades = parseSkills(content);
    else if (normalized === "idiomas") result.idiomas = parseLanguages(content);
    else if (normalized === "projetos") result.projetos = parseProjects(content);
    else if (normalized === "certificacoes") result.certificacoes = parseCertifications(content);
  }

  return result;
}

export const cvExemploMd = `# Seu Nome Completo
> Desenvolvedor Full Stack

**Email:** seu@email.com | **Telefone:** +55 11 99999-9999 | **Localização:** São Paulo, SP
**LinkedIn:** linkedin.com/in/seu-perfil | **GitHub:** github.com/seu-usuario

## Resumo

Profissional com X anos de experiência em desenvolvimento web. Foco em React, Node.js e arquitetura de sistemas escaláveis.

## Experiência

### Desenvolvedor Sênior @ Empresa Exemplo Ltda
_2022 - Presente | São Paulo, SP_

Liderança técnica em projetos de alto impacto.

- Redução de 40% no tempo de deploy com CI/CD
- Mentoria de 3 desenvolvedores juniores

## Formação

### Bacharelado em Ciência da Computação
_Universidade Exemplo · 2016 - 2020_

## Habilidades

JavaScript, TypeScript, React, Node.js, PostgreSQL, Tailwind CSS

## Idiomas

- Português: Nativo
- Inglês: Fluente

## Projetos

### Projeto Open Source
Ferramenta para desenvolvedores.
Technologies: React, TypeScript
[Ver no GitHub](https://github.com/seu-usuario/projeto)

## Certificações

- AWS Certified Developer · Amazon (2023)
`;
