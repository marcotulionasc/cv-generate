/**
 * Schema dos dados do currículo.
 * Use estas chaves no template .hbs com {{chave}} ou {{#each lista}}.
 */
export interface CVData {
  // Dados pessoais
  nome: string;
  titulo?: string; // ex: "Desenvolvedor Full Stack"
  email: string;
  telefone?: string;
  localizacao?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  website?: string;
  resumo?: string;

  // Experiência profissional
  experiencias: Experiencia[];

  // Formação
  formacao: Formacao[];

  // Habilidades (lista de strings ou categorizadas)
  habilidades: string[] | HabilidadeCategoria[];

  // Idiomas (opcional)
  idiomas?: Idioma[];

  // Projetos (opcional)
  projetos?: Projeto[];

  // Certificações (opcional)
  certificacoes?: Certificacao[];
}

export interface Experiencia {
  empresa: string;
  cargo: string;
  periodo: string; // ex: "Jan 2022 - Presente"
  local?: string;
  descricao?: string;
  conquistas?: string[];
}

export interface Formacao {
  instituicao: string;
  curso: string;
  periodo: string;
  descricao?: string;
}

export interface HabilidadeCategoria {
  categoria: string;
  itens: string[];
}

export interface Idioma {
  idioma: string;
  nivel: string; // ex: "Fluente", "Intermediário"
}

export interface Projeto {
  nome: string;
  descricao?: string;
  link?: string;
  tecnologias?: string[];
}

export interface Certificacao {
  nome: string;
  emissor?: string;
  ano?: string;
  link?: string;
}

/** Dados de exemplo para preview */
export const cvExemplo: CVData = {
  nome: "Marco Nascimento",
  titulo: "Desenvolvedor Full Stack",
  email: "marco@levacode.com.br",
  telefone: "+55 19 99760-2293",
  localizacao: "Campinas, SP",
  linkedin: "linkedin.com/in/marcotulionasc",
  instagram: "instagram.com/umarco.tech",
  resumo:
    "Desenvolvedor Full Stack apaixonado por criar produtos digitais com foco em experiência do usuário e arquitetura escalável.",
  experiencias: [
    {
      empresa: "Leva Code",
      cargo: "Fundador & Desenvolvedor Full Stack",
      periodo: "2023 - Presente",
      local: "Campinas, SP",
      descricao: "Desenvolvimento de produtos digitais e soluções web para clientes.",
      conquistas: [
        "Lançamento de plataformas web com Next.js e Node.js",
        "Mentoria e entrega de projetos end-to-end",
      ],
    },
  ],
  formacao: [
    {
      instituicao: "Universidade Exemplo",
      curso: "Bacharelado em Ciência da Computação",
      periodo: "2019 - 2023",
    },
  ],
  habilidades: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Tailwind CSS",
  ],
  idiomas: [
    { idioma: "Português", nivel: "Nativo" },
    { idioma: "Inglês", nivel: "Intermediário" },
  ],
  projetos: [
    {
      nome: "CV Generator",
      descricao: "Gerador de currículo profissional a partir de Markdown ou JSON.",
      tecnologias: ["Next.js", "TypeScript", "Puppeteer"],
    },
  ],
  certificacoes: [],
};
