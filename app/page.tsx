"use client";

import { useState } from "react";
import { TabBar } from "./components/TabBar";
import { MarkdownEditor } from "./components/MarkdownEditor";
import { DocxPreview } from "./components/DocxPreview";
import { SettingsPanel } from "./components/SettingsPanel";
import {
  DEFAULT_METADATA,
  DEFAULT_SETTINGS,
} from "@/app/lib/types";
import type { DocxMetadata, DocxSettings } from "@/app/lib/types";
import { convertMarkdownToDocx, triggerDownload } from "@/app/lib/convert";

const EXAMPLE_MARKDOWN = `# Título do Documento

## Introdução

Este é um exemplo de documento **Markdown** que será convertido para \`.docx\`.

### Funcionalidades

- Formatação **negrito** e *itálico*
- Código inline: \`const x = 42;\`
- Listas numeradas e com marcadores
- Blocos de código

## Bloco de Código

\`\`\`typescript
function greet(name: string): string {
  return \`Olá, \${name}!\`;
}
\`\`\`

### Lista Numerada

1. Primeiro item
2. Segundo item
   1. Sub-item
   2. Outro sub-item
3. Terceiro item

### Lista com Marcadores

- Item principal
  - Sub-item
  - Outro sub-item
- Outro item principal

## Conclusão

Documento gerado automaticamente a partir de Markdown.
`;

export default function Home() {
  const [activeTab, setActiveTab] = useState<"editor" | "settings">("editor");
  const [markdown, setMarkdown] = useState(EXAMPLE_MARKDOWN);
  const [metadata, setMetadata] = useState<DocxMetadata>(DEFAULT_METADATA);
  const [settings, setSettings] = useState<DocxSettings>(DEFAULT_SETTINGS);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const handleConvert = async () => {
    setIsConverting(true);
    setError(null);

    try {
      const blob = await convertMarkdownToDocx(markdown, metadata, settings);
      const filename =
        metadata.title.enabled && metadata.title.value
          ? `${metadata.title.value.replace(/\s+/g, "_")}.docx`
          : "documento.docx";
      triggerDownload(blob, filename);
    } catch (err) {
      console.error(err);
      setError("Erro ao converter o documento. Verifique o Markdown.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Markdown → DOCX</h1>
        <p className="app-subtitle">
          Escreva Markdown, configure o documento e baixe o .docx
        </p>
      </header>

      <div className="app-content">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="tab-content">
          {activeTab === "editor" && (
            <>
              <div className="editor-toggles">
                <label className="editor-toggle-label">
                  <span className="editor-toggle-switch">
                    <input
                      type="checkbox"
                      checked={showEditor}
                      onChange={(e) => setShowEditor(e.target.checked)}
                    />
                    <span className="editor-toggle-track" />
                  </span>
                  Editor
                </label>
                <label className="editor-toggle-label">
                  <span className="editor-toggle-switch">
                    <input
                      type="checkbox"
                      checked={showPreview}
                      onChange={(e) => setShowPreview(e.target.checked)}
                    />
                    <span className="editor-toggle-track" />
                  </span>
                  Pré-visualização
                </label>
              </div>
              <div
                className="editor-layout"
                data-show-editor={showEditor}
                data-show-preview={showPreview}
              >
                {showEditor && (
                  <div className="editor-pane">
                    <MarkdownEditor value={markdown} onChange={setMarkdown} />
                  </div>
                )}
                {showPreview && (
                  <div className="preview-pane">
                    <DocxPreview
                      markdown={markdown}
                      metadata={metadata}
                      settings={settings}
                    />
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === "settings" && (
            <SettingsPanel
              metadata={metadata}
              settings={settings}
              onMetadataChange={setMetadata}
              onSettingsChange={setSettings}
            />
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="actions">
          <button
            className="convert-button"
            onClick={handleConvert}
            disabled={isConverting || !markdown.trim()}
          >
            {isConverting ? "Convertendo..." : "Converter & Baixar .docx"}
          </button>
        </div>
      </div>
    </div>
  );
}
