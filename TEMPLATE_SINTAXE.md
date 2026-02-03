# Como escrever seu template de CV em .hbs

Este projeto usa **Handlebars** (`.hbs`) para montar o currículo. O template recebe um objeto de dados (o JSON que você edita na tela) e gera o HTML final. Assim você mantém o layout organizado, reutilizável e bonito com Tailwind CSS.

---

## Onde fica o template

- **Template padrão:** `src/templates/default.hbs`
- Você pode criar outros arquivos `.hbs` na pasta `src/templates/` e alterar o código em `src/lib/render-cv.ts` para usar o template que quiser.

---

## Sintaxe Handlebars (resumo)

| Sintaxe | Uso |
|--------|-----|
| `{{chave}}` | Valor da chave (escapado para HTML) |
| `{{{chave}}}` | Valor da chave **sem** escapar (use só se for HTML seguro) |
| `{{#if chave}}...{{/if}}` | Mostra o bloco só se `chave` existir e for “truthy” |
| `{{#each lista}}...{{/each}}` | Repete o bloco para cada item da lista |
| `{{this}}` | Dentro de `{{#each}}`, é o item atual |
| `{{!-- comentário --}}` | Comentário (não aparece no HTML) |

---

## Dados disponíveis no template (chaves do JSON)

Use estas chaves no `.hbs` exatamente como estão no JSON.

### Dados pessoais (sempre disponíveis)

| Chave | Tipo | Exemplo no template |
|-------|------|----------------------|
| `nome` | string | `{{nome}}` |
| `titulo` | string (opcional) | `{{titulo}}` — ex: "Desenvolvedor Full Stack" |
| `email` | string | `{{email}}` |
| `telefone` | string (opcional) | `{{telefone}}` |
| `localizacao` | string (opcional) | `{{localizacao}}` |
| `linkedin` | string (opcional) | `{{linkedin}}` |
| `github` | string (opcional) | `{{github}}` |
| `website` | string (opcional) | `{{website}}` |
| `resumo` | string (opcional) | `{{resumo}}` |

### Experiência profissional

Array `experiencias`. Cada item tem:

- `empresa`, `cargo`, `periodo`, `local` (opcional), `descricao` (opcional), `conquistas` (opcional, array de strings)

**Exemplo no template:**

```handlebars
{{#if experiencias}}
  <section>
    <h2>Experiência profissional</h2>
    {{#each experiencias}}
      <div>
        <h3>{{cargo}}</h3>
        <p>{{empresa}} · {{periodo}}</p>
        {{#if descricao}}<p>{{descricao}}</p>{{/if}}
        {{#if conquistas}}
          <ul>
            {{#each conquistas}}<li>{{this}}</li>{{/each}}
          </ul>
        {{/if}}
      </div>
    {{/each}}
  </section>
{{/if}}
```

### Formação

Array `formacao`. Cada item tem:

- `instituicao`, `curso`, `periodo`, `descricao` (opcional)

**Exemplo:**

```handlebars
{{#if formacao}}
  <section>
    <h2>Formação</h2>
    {{#each formacao}}
      <div>
        <h3>{{curso}}</h3>
        <p>{{instituicao}} · {{periodo}}</p>
      </div>
    {{/each}}
  </section>
{{/if}}
```

### Habilidades (dois formatos)

O sistema normaliza automaticamente:

1. **Lista simples** (array de strings) → no template use **`habilidadesLista`**:
   ```handlebars
   {{#each habilidadesLista}}
     <span>{{this}}</span>
   {{/each}}
   ```

2. **Por categoria** (array de `{ categoria, itens }`) → use **`habilidadesCategorias`**:
   ```handlebars
   {{#each habilidadesCategorias}}
     <p>{{categoria}}</p>
     {{#each itens}}<span>{{this}}</span>{{/each}}
   {{/each}}
   ```

### Idiomas (opcional)

Array `idiomas`. Cada item: `idioma`, `nivel`.

```handlebars
{{#if idiomas}}
  {{#each idiomas}}
    <li>{{idioma}} — {{nivel}}</li>
  {{/each}}
{{/if}}
```

### Projetos (opcional)

Array `projetos`. Cada item: `nome`, `descricao`, `link`, `tecnologias` (array).

### Certificações (opcional)

Array `certificacoes`. Cada item: `nome`, `emissor`, `ano`, `link`.

---

## Dicas para deixar o CV “arrebentando”

1. **Use Tailwind no `.hbs`**  
   O template padrão já usa Tailwind via CDN. Mantenha classes como `text-slate-700`, `font-semibold`, `rounded-lg`, `shadow-xl`, etc. para um visual limpo e consistente.

2. **Estrutura semântica**  
   Use `<header>`, `<section>`, `<article>`, `<h1>`–`<h3>` para boa hierarquia e acessibilidade.

3. **Condicionais**  
   Só mostre blocos quando houver dado: `{{#if resumo}}...{{/if}}`, `{{#if experiencias}}...{{/if}}`.

4. **Links**  
   Para `linkedin`, `github`, `website` e links em projetos/certificações, use `<a href="...">` e, se quiser abrir em nova aba: `target="_blank" rel="noopener"`.

5. **Responsivo**  
   Use classes Tailwind como `md:text-lg`, `flex-wrap`, `max-w-4xl mx-auto` para o CV ficar bom em tela e na impressão/PDF.

6. **Impressão/PDF**  
   O HTML gerado pode ser aberto no navegador e impresso (Ctrl+P) ou “Salvar como PDF” para enviar na candidatura.

---

## Exemplo mínimo de template

```handlebars
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-slate-800 p-8">
  <h1 class="text-3xl font-bold">{{nome}}</h1>
  <p class="text-slate-600">{{email}}</p>
  {{#if resumo}}<p class="mt-4">{{resumo}}</p>{{/if}}
  {{#each experiencias}}
    <div class="mt-6">
      <h2 class="font-semibold">{{cargo}} — {{empresa}}</h2>
      <p class="text-sm text-slate-500">{{periodo}}</p>
    </div>
  {{/each}}
</body>
</html>
```

Basta manter o mesmo **objeto de dados** (o JSON da aplicação) e trocar o conteúdo do `.hbs` para mudar layout e estilo sem alterar a lógica de dados.
