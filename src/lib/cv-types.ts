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
  nome: "Seu Nome Completo",
  titulo: "Desenvolvedor Full Stack",
  email: "seu@email.com",
  telefone: "+55 11 99999-9999",
  localizacao: "São Paulo, SP",
  linkedin: "linkedin.com/in/seu-perfil",
  github: "github.com/seu-usuario",
  resumo:
    "Profissional com X anos de experiência em desenvolvimento web. Foco em React, Node.js e arquitetura de sistemas escaláveis.",
  experiencias: [
    {
      empresa: "Empresa Exemplo Ltda",
      cargo: "Desenvolvedor Sênior",
      periodo: "2022 - Presente",
      local: "São Paulo, SP",
      descricao: "Liderança técnica em projetos de alto impacto.",
      conquistas: [
        "Redução de 40% no tempo de deploy com CI/CD",
        "Mentoria de 3 desenvolvedores juniores",
      ],
    },
  ],
  formacao: [
    {
      instituicao: "Universidade Exemplo",
      curso: "Bacharelado em Ciência da Computação",
      periodo: "2016 - 2020",
    },
  ],
  habilidades: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "Tailwind CSS",
  ],
  idiomas: [
    { idioma: "Português", nivel: "Nativo" },
    { idioma: "Inglês", nivel: "Fluente" },
  ],
  projetos: [
    {
      nome: "Projeto Open Source",
      descricao: "Ferramenta para desenvolvedores.",
      link: "https://github.com/...",
      tecnologias: ["React", "TypeScript"],
    },
  ],
  certificacoes: [
    { nome: "AWS Certified Developer", emissor: "Amazon", ano: "2023" },
  ],
};
