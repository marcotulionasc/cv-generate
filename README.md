# Gerador de CV

Gerador de currículo em HTML usando templates **Handlebars** (`.hbs`) e **Tailwind CSS**. Você edita os dados em JSON e o layout no template para gerar um CV organizado e bonito para suas candidaturas.

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Como usar

1. **Dados do currículo:** edite o JSON na tela (ou use "Carregar exemplo").
2. **Preview:** clique em "Gerar preview" para ver o currículo renderizado.
3. **Download:** use "Baixar HTML" para salvar o arquivo e abrir/imprimir/salvar como PDF.

O template padrão está em **`src/templates/default.hbs`**. Você pode alterá-lo ou criar novos `.hbs` na pasta `src/templates/` e ajustar `src/lib/render-cv.ts` para usá-los.

## Como escrever seu template (.hbs)

Leia o arquivo **`TEMPLATE_SINTAXE.md`** na raiz do projeto. Lá está:

- Sintaxe Handlebars (`{{chave}}`, `{{#each}}`, `{{#if}}`, etc.).
- Todas as chaves disponíveis no template (nome, email, experiências, formação, habilidades, idiomas, projetos, certificações).
- Exemplos de blocos para cada seção.
- Dicas para deixar o CV “arrebentando” com Tailwind e boa estrutura.

Resumo: você escreve o HTML do currículo em `.hbs` usando as chaves do JSON (ex.: `{{nome}}`, `{{#each experiencias}}`) e classes Tailwind para o visual. O sistema injeta os dados e gera o HTML final.

## Estrutura do projeto

- `src/app/page.tsx` — tela com editor JSON e preview.
- `src/app/api/render/route.ts` — API que recebe o JSON e devolve o HTML do CV.
- `src/lib/cv-types.ts` — tipos e dados de exemplo do currículo.
- `src/lib/render-cv.ts` — compila o template `.hbs` e renderiza com os dados.
- `src/templates/default.hbs` — template padrão do currículo (Tailwind).

## Stack

- **Next.js 16** (App Router)
- **Handlebars** — templates `.hbs`
- **Tailwind CSS** — estilos no template (via CDN no HTML gerado)
