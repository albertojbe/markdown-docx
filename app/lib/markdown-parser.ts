export interface ParsedLine {
  type: "heading" | "bullet" | "numbered" | "code_fence_open" | "code_line" | "code_fence_close" | "blank" | "paragraph";
  content: string;
  level?: number;
  indent?: number;
  language?: string;
}

const HEADING_RE = /^(#{1,4})\s+(.*)/;
const BULLET_RE = /^(\s*)[-*]\s+(.*)/;
const NUMBERED_RE = /^(\s*)\d+[.)]\s+(.*)/;

export function parseMarkdown(text: string): string[] {
  return text.split("\n");
}

export function* parseLines(lines: string[]): IterableIterator<ParsedLine> {
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Code fence
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      yield { type: "code_fence_open", content: "", language: lang };
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        yield { type: "code_line", content: lines[i] };
        i++;
      }
      if (i < lines.length) {
        yield { type: "code_fence_close", content: "" };
        i++;
      }
      continue;
    }

    // Heading
    const headingMatch = line.match(HEADING_RE);
    if (headingMatch) {
      yield {
        type: "heading",
        content: headingMatch[2].trim(),
        level: headingMatch[1].length,
      };
      i++;
      continue;
    }

    // Bullet list
    const bulletMatch = line.match(BULLET_RE);
    if (bulletMatch) {
      const indentLen = bulletMatch[1].length;
      yield {
        type: "bullet",
        content: bulletMatch[2],
        indent: Math.floor(indentLen / 2),
      };
      i++;
      continue;
    }

    // Numbered list
    const numberedMatch = line.match(NUMBERED_RE);
    if (numberedMatch) {
      const indentLen = numberedMatch[1].length;
      yield {
        type: "numbered",
        content: numberedMatch[2],
        indent: Math.floor(indentLen / 3),
      };
      i++;
      continue;
    }

    // Blank line
    if (!line.trim()) {
      yield { type: "blank", content: "" };
      i++;
      continue;
    }

    // Paragraph
    yield { type: "paragraph", content: line.trim() };
    i++;
  }
}
