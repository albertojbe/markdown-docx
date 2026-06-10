"use client";

import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import type { DocxMetadata, DocxSettings } from "@/app/lib/types";
import { convertMarkdownToDocx } from "@/app/lib/convert";

type DocxPreviewProps = {
  markdown: string;
  metadata: DocxMetadata;
  settings: DocxSettings;
};

export function DocxPreview({ markdown, metadata, settings }: DocxPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!markdown.trim()) {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    let cancelled = false;

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const blob = await convertMarkdownToDocx(markdown, metadata, settings);

        if (controller.signal.aborted || cancelled) return;

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          await renderAsync(blob, containerRef.current, undefined, {
            breakPages: true,
            ignoreFonts: false,
            trimXmlDeclaration: true,
          });
        }
      } catch (err) {
        if (!controller.signal.aborted && !cancelled) {
          console.error(err);
          setError("Erro ao gerar pré-visualização.");
        }
      } finally {
        if (!controller.signal.aborted && !cancelled) {
          setIsLoading(false);
        }
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [markdown, metadata, settings]);

  return (
    <div className="preview-container">
      <div className="preview-header">
        <span className="preview-label">Pré-visualização</span>
        {isLoading && <span className="preview-status">Atualizando...</span>}
      </div>
      {error && <div className="preview-error">{error}</div>}
      <div className="preview-scroll">
        <div ref={containerRef} className="preview-document" />
      </div>
    </div>
  );
}
