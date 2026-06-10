import { Packer } from "docx";
import { buildDocument } from "@/app/lib/docx-builder";
import type { DocxMetadata, DocxSettings } from "@/app/lib/types";

export async function convertMarkdownToDocx(
  markdown: string,
  metadata: DocxMetadata,
  settings: DocxSettings
): Promise<Blob> {
  const doc = buildDocument(markdown, metadata, settings);
  return Packer.toBlob(doc);
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
