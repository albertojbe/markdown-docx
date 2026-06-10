# Markdown → DOCX

Conversor de texto Markdown para documentos `.docx` com pré-visualização.

## Funcionalidades

- **Editor Markdown** com syntax highlighting e formatação inline (negrito, itálico, código)
- **Pré-visualização** do documento `.docx` renderizada no navegador via `docx-preview`
- **Toggles de visibilidade** para alternar entre editor e preview
- **Geração de tabela** a partir da notação de tabelas Markdown
- **Página de capa** configurável com título, subtítulo, autor, data, versão, organização e palavras-chave
- **Cabeçalho e rodapé** com informações do documento e numeração de páginas
- **Listas** numeradas e com marcadores (4 níveis de aninhamento)
- **Blocos de código** com estilo monoespaço e fundo destacado
- **Títulos** (H1–H4) com cores e estilos configuráveis
- **Configuração de fontes**, cores, margens e layout do documento
- **Download direto** do arquivo `.docx` gerado
- **Layout responsivo** com suporte a telas mobile

## Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| [Next.js](https://nextjs.org/) | 16 | Framework React (App Router) |
| [React](https://react.dev/) | 19 | Interface do usuário |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Estilização |
| [docx](https://docx.js.org/) | 9 | Geração de documentos `.docx` |
| [docx-preview](https://github.com/VolodymyrBaydalka/docxjs) | 0.3 | Renderização de DOCX no navegador |

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+ (recomendado 20+)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) ou [pnpm](https://pnpm.io/)

## Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd markdown-docx

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm start` | Inicia o servidor de produção |
| `npm run lint` | Executa o ESLint |

## Uso

1. **Escreva Markdown** na aba "Editor"
2. **Configure o documento** na aba "Configurações" (metadados, fontes, cores, margens)
3. **Ative o preview** usando o toggle "Pré-visualização" para ver o resultado em tempo real
4. **Clique em "Converter & Baixar .docx"** para baixar o arquivo

### Sintaxe Markdown Suportada

```markdown
# Título H1
## Título H2
### Título H3
#### Título H4

**Negrito** e *itálico*

`código inline`

- Lista com marcadores
  - Sub-item

1. Lista numerada
   1. Sub-item

| Coluna 1 | Coluna 2 |
|----------|----------|
| Dado 1   | Dado 2   |

```typescript
const codigo = "bloco de código";
```
```

### Metadados Configuráveis

| Campo | Descrição |
|-------|-----------|
| Título | Título do documento (aparece na capa e cabeçalho) |
| Subtítulo | Subtítulo do documento |
| Autor | Nome do autor |
| Data | Data de criação |
| Versão | Versão do documento |
| Organização | Nome da organização |
| Palavras-chave | Palavras-chave do documento |

### Opções de Estilo

| Opção | Padrão | Descrição |
|-------|--------|-----------|
| Fonte principal | Calibri | Fonte do corpo do texto |
| Fonte monoespaço | Courier New | Fonte para blocos de código |
| Cor H1 | #1F497D | Cor dos títulos nível 1 |
| Cor H2 | #2E75B6 | Cor dos títulos nível 2 |
| Cor H3 | #2E75B6 | Cor dos títulos nível 3 |
| Cor H4 | #404040 | Cor dos títulos nível 4 |
| Cor de fundo do código | #F2F2F2 | Fundo dos blocos de código |
| Cor da fonte do código | #C7254E | Cor do texto em blocos de código |
| Margens | 2.5cm (topo/fundo), 3.0cm (esq), 2.5cm (dir) | Margens da página |

## Estrutura do Projeto

```
markdown-docx/
├── app/
│   ├── components/
│   │   ├── DocxPreview.tsx    # Componente de pré-visualização
│   │   ├── MarkdownEditor.tsx # Componente do editor Markdown
│   │   ├── SettingsPanel.tsx  # Painel de configurações
│   │   └── TabBar.tsx         # Barra de abas
│   ├── lib/
│   │   ├── convert.ts         # Orquestração da conversão
│   │   ├── docx-builder.ts    # Construtor do documento DOCX
│   │   ├── markdown-parser.ts # Parser de Markdown (não utilizado)
│   │   └── types.ts           # Definições de tipos
│   ├── globals.css            # Estilos globais
│   ├── layout.tsx             # Layout raiz
│   └── page.tsx               # Página principal
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Licença

MIT
