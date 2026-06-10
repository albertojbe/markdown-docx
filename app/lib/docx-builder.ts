import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  AlignmentType,
  LevelFormat,
  convertInchesToTwip,
  ShadingType,
  PageBreak,
} from "docx";
import type { DocxMetadata, DocxSettings, MetadataField } from "@/app/lib/types";

const INLINE_RE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(_[^_]+_)/g;

function buildInlineRuns(
  text: string,
  baseSize: number,
  settings: DocxSettings
): TextRun[] {
  const runs: TextRun[] = [];
  let last = 0;

  for (const m of text.matchAll(INLINE_RE)) {
    if (m.index! > last) {
      runs.push(
        new TextRun({
          text: text.slice(last, m.index!),
          font: settings.mainFont,
          size: baseSize * 2,
        })
      );
    }

    const raw = m[0];
    if (raw.startsWith("`")) {
      runs.push(
        new TextRun({
          text: raw.slice(1, -1),
          font: settings.monoFont,
          size: (baseSize - 1) * 2,
          color: settings.codeFontColor.replace("#", ""),
        })
      );
    } else if (raw.startsWith("**")) {
      runs.push(
        new TextRun({
          text: raw.slice(2, -2),
          bold: true,
          font: settings.mainFont,
          size: baseSize * 2,
        })
      );
    } else {
      runs.push(
        new TextRun({
          text: raw.slice(1, -1),
          italics: true,
          font: settings.mainFont,
          size: baseSize * 2,
        })
      );
    }
    last = m.index! + raw.length;
  }

  if (last < text.length) {
    runs.push(
      new TextRun({
        text: text.slice(last),
        font: settings.mainFont,
        size: baseSize * 2,
      })
    );
  }

  if (runs.length === 0) {
    runs.push(
      new TextRun({
        text,
        font: settings.mainFont,
        size: baseSize * 2,
      })
    );
  }

  return runs;
}

function buildCodeBlock(
  lines: string[],
  settings: DocxSettings
): (Paragraph | Table)[] {
  const codeParagraphs = lines.map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            font: settings.monoFont,
            size: 9 * 2,
            color: "1E1E1E",
          }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: convertInchesToTwip(0.12) },
      })
  );

  const cell = new TableCell({
    children: codeParagraphs,
    shading: {
      type: ShadingType.CLEAR,
      color: "auto",
      fill: settings.codeBgColor.replace("#", ""),
    },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    },
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  return [
    new Paragraph({ children: [], spacing: { after: 80 } }),
    new Table({
      rows: [new TableRow({ children: [cell] })],
      width: { size: 100, type: WidthType.PERCENTAGE },
    }),
  ];
}

function buildTable(
  rows: string[][],
  settings: DocxSettings
): Table {
  const FONT_SIZE = 10;
  const headerRowIndex = 0;
  const colCount = Math.max(...rows.map((r) => r.length));

  const tableRows = rows.map((row, rowIndex) => {
    const isHeader = rowIndex === headerRowIndex && rows.length > 1;
    const cells: TableCell[] = [];

    for (let col = 0; col < colCount; col++) {
      const cellText = row[col] ?? "";
      const runs = isHeader
        ? [
            new TextRun({
              text: cellText,
              bold: true,
              color: "FFFFFF",
              font: settings.mainFont,
              size: FONT_SIZE * 2,
            }),
          ]
        : buildInlineRuns(cellText, FONT_SIZE, settings);

      cells.push(
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 40, after: 40 },
              children: runs,
            }),
          ],
          shading: isHeader
            ? {
                type: ShadingType.CLEAR,
                color: "auto",
                fill: settings.colorH2.replace("#", ""),
              }
            : undefined,
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
          },
          width: { size: Math.round(100 / colCount), type: WidthType.PERCENTAGE },
        })
      );
    }

    return new TableRow({
      children: cells,
      tableHeader: isHeader,
    });
  });

  return new Table({
    rows: tableRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function buildCoverPage(
  metadata: DocxMetadata,
  settings: DocxSettings
): (Paragraph | Table)[] {
  const paragraphs: (Paragraph | Table)[] = [];

  for (let i = 0; i < 6; i++) {
    paragraphs.push(new Paragraph({ children: [], spacing: { after: 200 } }));
  }

  if (metadata.title.enabled && metadata.title.value) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        border: {
          bottom: {
            color: settings.colorH1.replace("#", ""),
            space: 1,
            style: "single",
            size: 12,
          },
        },
        children: [
          new TextRun({
            text: metadata.title.value,
            bold: true,
            font: settings.mainFont,
            size: 28 * 2,
            color: settings.colorH1.replace("#", ""),
          }),
        ],
      })
    );
  }

  if (metadata.subtitle.enabled && metadata.subtitle.value) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: metadata.subtitle.value,
            italics: true,
            font: settings.mainFont,
            size: 16 * 2,
            color: settings.colorH2.replace("#", ""),
          }),
        ],
      })
    );
  }

  paragraphs.push(new Paragraph({ children: [], spacing: { after: 200 } }));

  const metaEntries: [MetadataField<string>, string][] = [
    [metadata.author, "Autor"],
    [metadata.date, "Data"],
    [metadata.version, "Versão"],
    [metadata.organization, "Organização"],
  ];

  for (const [field, label] of metaEntries) {
    if (field.enabled && field.value) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: `${label}: `,
              bold: true,
              font: settings.mainFont,
              size: 11 * 2,
              color: "404040",
            }),
            new TextRun({
              text: field.value,
              font: settings.mainFont,
              size: 11 * 2,
              color: "606060",
            }),
          ],
        })
      );
    }
  }

  if (metadata.keywords.enabled && metadata.keywords.value) {
    paragraphs.push(new Paragraph({ children: [], spacing: { after: 200 } }));
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: "Palavras-chave: " + metadata.keywords.value,
            italics: true,
            font: settings.mainFont,
            size: 10 * 2,
            color: "808080",
          }),
        ],
      })
    );
  }

  paragraphs.push(
    new Paragraph({ children: [new PageBreak()] })
  );

  return paragraphs;
}

function buildHeader(settings: DocxSettings, metadata: DocxMetadata): Header {
  const children: TextRun[] = [];

  if (metadata.organization.enabled && metadata.organization.value) {
    children.push(
      new TextRun({
        text: metadata.organization.value,
        font: settings.mainFont,
        size: 9 * 2,
        color: "707070",
        italics: true,
      })
    );
    children.push(
      new TextRun({
        text: "  |  ",
        font: settings.mainFont,
        size: 9 * 2,
        color: "707070",
        italics: true,
      })
    );
  }

  if (metadata.title.enabled && metadata.title.value) {
    children.push(
      new TextRun({
        text: metadata.title.value,
        font: settings.mainFont,
        size: 9 * 2,
        color: "707070",
        italics: true,
      })
    );
  }

  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        border: {
          bottom: {
            color: "CCCCCC",
            space: 1,
            style: "single",
            size: 6,
          },
        },
        children:
          children.length > 0
            ? children
            : [
                new TextRun({
                  text: " ",
                  font: settings.mainFont,
                  size: 9 * 2,
                }),
              ],
      }),
    ],
  });
}

function buildFooter(
  settings: DocxSettings,
  metadata: DocxMetadata
): Footer {
  const parts: string[] = [];

  if (metadata.author.enabled && metadata.author.value) {
    parts.push(metadata.author.value);
  }
  if (metadata.date.enabled && metadata.date.value) {
    parts.push(metadata.date.value);
  }
  if (metadata.version.enabled && metadata.version.value) {
    parts.push(`v${metadata.version.value}`);
  }

  const footerText = parts.length > 0 ? parts.join("  ·  ") + "   " : "";

  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: footerText,
            font: settings.mainFont,
            size: 9 * 2,
            color: "707070",
          }),
          new TextRun({
            text: " Pág. ",
            font: settings.mainFont,
            size: 9 * 2,
            color: "707070",
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            font: settings.mainFont,
            size: 9 * 2,
            color: "707070",
          }),
        ],
      }),
    ],
  });
}

function buildEmptyHeader(): Header {
  return new Header({
    children: [new Paragraph({ children: [] })],
  });
}

function buildEmptyFooter(): Footer {
  return new Footer({
    children: [new Paragraph({ children: [] })],
  });
}

function parseLines(
  text: string
): Array<{
  type: string;
  content: string;
  level?: number;
  indent?: number;
  language?: string;
  rows?: string[][];
}> {
  const HEADING_RE = /^(#{1,4})\s+(.*)/;
  const BULLET_RE = /^(\s*)[-*]\s+(.*)/;
  const NUMBERED_RE = /^(\s*)\d+[.)]\s+(.*)/;
  const TABLE_ROW_RE = /^\|(.+)\|$/;
  const TABLE_SEP_RE = /^\|[\s:]*-+[\s:]*(\|[\s:]*-+[\s:]*)*\|$/;
  const lines = text.split("\n");
  const result: Array<{
    type: string;
    content: string;
    level?: number;
    indent?: number;
    language?: string;
    rows?: string[][];
  }> = [];

  function isTableRow(line: string): boolean {
    return TABLE_ROW_RE.test(line.trim());
  }

  function isTableSeparator(line: string): boolean {
    return TABLE_SEP_RE.test(line.trim());
  }

  function parseTableRowCells(line: string): string[] {
    const trimmed = line.trim();
    const inner = trimmed.slice(1, -1);
    return inner.split("|").map((c) => c.trim());
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      result.push({ type: "code_fence_open", content: "", language: lang });
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        result.push({ type: "code_line", content: lines[i] });
        i++;
      }
      if (i < lines.length) {
        result.push({ type: "code_fence_close", content: "" });
        i++;
      }
      continue;
    }

    const headingMatch = line.match(HEADING_RE);
    if (headingMatch) {
      result.push({
        type: "heading",
        content: headingMatch[2].trim(),
        level: headingMatch[1].length,
      });
      i++;
      continue;
    }

    const bulletMatch = line.match(BULLET_RE);
    if (bulletMatch) {
      result.push({
        type: "bullet",
        content: bulletMatch[2],
        indent: Math.floor(bulletMatch[1].length / 2),
      });
      i++;
      continue;
    }

    const numberedMatch = line.match(NUMBERED_RE);
    if (numberedMatch) {
      result.push({
        type: "numbered",
        content: numberedMatch[2],
        indent: Math.floor(numberedMatch[1].length / 3),
      });
      i++;
      continue;
    }

    // Table detection: collect consecutive table-like lines
    if (isTableRow(line) || isTableSeparator(line)) {
      const tableLines: string[] = [];
      while (i < lines.length && (isTableRow(lines[i]) || isTableSeparator(lines[i]))) {
        tableLines.push(lines[i]);
        i++;
      }

      if (tableLines.length >= 2) {
        const rows: string[][] = [];
        for (let r = 0; r < tableLines.length; r++) {
          if (isTableSeparator(tableLines[r])) continue;
          rows.push(parseTableRowCells(tableLines[r]));
        }
        result.push({ type: "table", content: "", rows });
      } else {
        // Single table-like line is not a table, treat as paragraph
        result.push({ type: "paragraph", content: tableLines[0].trim() });
      }
      continue;
    }

    if (!line.trim()) {
      result.push({ type: "blank", content: "" });
      i++;
      continue;
    }

    result.push({ type: "paragraph", content: line.trim() });
    i++;
  }

  return result;
}

export function buildDocument(
  markdown: string,
  metadata: DocxMetadata,
  settings: DocxSettings
): Document {
  const parsed = parseLines(markdown);
  const contentChildren: (Paragraph | Table)[] = [];

  // Cover page
  if (
    settings.showCoverPage &&
    metadata.title.enabled &&
    metadata.title.value
  ) {
    contentChildren.push(...buildCoverPage(metadata, settings));
  }

  let inCodeBlock = false;
  const codeLines: string[] = [];
  const listCounters: Map<number, number> = new Map();

  for (const item of parsed) {
    // Code block
    if (item.type === "code_fence_open") {
      inCodeBlock = true;
      codeLines.length = 0;
      continue;
    }
    if (item.type === "code_fence_close") {
      inCodeBlock = false;
      contentChildren.push(...buildCodeBlock(codeLines, settings));
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(item.content);
      continue;
    }

    // Headings
    if (item.type === "heading" && item.level) {
      const level = item.level;
      let fontSize: number;
      let color: string;
      const bold = true;
      let italic = false;
      const underline = false;

      switch (level) {
        case 1:
          fontSize = 16;
          color = settings.colorH1;
          break;
        case 2:
          fontSize = 13;
          color = settings.colorH2;
          break;
        case 3:
          fontSize = 12;
          color = settings.colorH3;
          break;
        case 4:
          fontSize = 11;
          color = settings.colorH4;
          italic = true;
          break;
        default:
          fontSize = 11;
          color = settings.colorH4;
      }

      const textRun = new TextRun({
        text: item.content,
        bold,
        italics: italic,
        underline: underline ? { type: "single" as never } : undefined,
        font: settings.mainFont,
        size: fontSize * 2,
        color: level === 1 ? "FFFFFF" : color.replace("#", ""),
      });

      if (level === 1) {
        const h1Cell = new TableCell({
          children: [
            new Paragraph({
              spacing: {
                before: 120,
                after: 60,
              },
              indent: {
                left: convertInchesToTwip(0.3),
              },
              children: [textRun],
            }),
          ],
          shading: {
            type: ShadingType.CLEAR,
            color: "auto",
            fill: settings.colorH1.replace("#", ""),
          },
          borders: {
            top: { style: BorderStyle.NONE, size: 0 },
            bottom: { style: BorderStyle.NONE, size: 0 },
            left: { style: BorderStyle.NONE, size: 0 },
            right: { style: BorderStyle.NONE, size: 0 },
          },
          width: { size: 100, type: WidthType.PERCENTAGE },
        });

        contentChildren.push(
          new Table({
            rows: [new TableRow({ children: [h1Cell] })],
            width: { size: 100, type: WidthType.PERCENTAGE },
          })
        );
      } else if (level === 2) {
        contentChildren.push(
          new Paragraph({
            spacing: {
              before: 280,
              after: 80,
            },
            border: {
              bottom: {
                color: settings.colorH2.replace("#", ""),
                space: 1,
                style: "single",
                size: 12,
              },
            },
            children: [textRun],
          })
        );
      } else {
        contentChildren.push(
          new Paragraph({
            spacing: {
              before: level === 3 ? 200 : 160,
              after: level === 3 ? 60 : 40,
            },
            children: [textRun],
          })
        );
      }
      listCounters.clear();
      continue;
    }

    // Bullet list
    if (item.type === "bullet") {
      const nestLevel = item.indent ?? 0;
      const runs = buildInlineRuns(item.content, 11, settings);

      contentChildren.push(
        new Paragraph({
          numbering: {
            reference: "bullet-list",
            level: Math.min(nestLevel, 3),
          },
          spacing: { after: 40 },
          children: runs,
        })
      );
      continue;
    }

    // Numbered list
    if (item.type === "numbered") {
      const nestLevel = item.indent ?? 0;
      const runs = buildInlineRuns(item.content, 11, settings);

      listCounters.set(nestLevel, (listCounters.get(nestLevel) ?? 0) + 1);
      for (const k of Array.from(listCounters.keys())) {
        if (k > nestLevel) listCounters.delete(k);
      }

      contentChildren.push(
        new Paragraph({
          numbering: {
            reference: "numbered-list",
            level: Math.min(nestLevel, 3),
          },
          spacing: { after: 40 },
          children: runs,
        })
      );
      continue;
    }

    if (item.type === "blank") continue;

    // Table
    if (item.type === "table" && item.rows && item.rows.length > 0) {
      contentChildren.push(
        new Paragraph({ children: [], spacing: { after: 80 } })
      );
      contentChildren.push(buildTable(item.rows, settings));
      contentChildren.push(
        new Paragraph({ children: [], spacing: { after: 120 } })
      );
      listCounters.clear();
      continue;
    }

    // Paragraph
    if (item.type === "paragraph") {
      const runs = buildInlineRuns(item.content, 11, settings);
      contentChildren.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 120, before: 0 },
          children: runs,
        })
      );
    }
  }

  // Flush incomplete code block
  if (inCodeBlock && codeLines.length > 0) {
    contentChildren.push(...buildCodeBlock(codeLines, settings));
  }

  return new Document({
    numbering: {
      config: [
        {
          reference: "bullet-list",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u2022",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.5),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
              },
            },
            {
              level: 1,
              format: LevelFormat.BULLET,
              text: "\u25E6",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(1.0),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
              },
            },
            {
              level: 2,
              format: LevelFormat.BULLET,
              text: "\u25AA",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(1.5),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
              },
            },
            {
              level: 3,
              format: LevelFormat.BULLET,
              text: "\u25AB",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(2.0),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
              },
            },
          ],
        },
        {
          reference: "numbered-list",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(0.5),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
              },
            },
            {
              level: 1,
              format: LevelFormat.LOWER_LETTER,
              text: "%2)",
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(1.0),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
              },
            },
            {
              level: 2,
              format: LevelFormat.LOWER_ROMAN,
              text: "%3.",
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(1.5),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
              },
            },
            {
              level: 3,
              format: LevelFormat.DECIMAL,
              text: "%4.",
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: {
                    left: convertInchesToTwip(2.0),
                    hanging: convertInchesToTwip(0.25),
                  },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertCmToTwip(settings.marginTop),
              bottom: convertCmToTwip(settings.marginBottom),
              left: convertCmToTwip(settings.marginLeft),
              right: convertCmToTwip(settings.marginRight),
            },
          },
          titlePage: settings.showHeaderFooter,
        },
        headers: settings.showHeaderFooter
          ? {
              default: buildHeader(settings, metadata),
              first: buildEmptyHeader(),
            }
          : undefined,
        footers: settings.showHeaderFooter
          ? {
              default: buildFooter(settings, metadata),
              first: buildEmptyFooter(),
            }
          : undefined,
        children: contentChildren,
      },
    ],
  });
}

function convertCmToTwip(cm: number): number {
  return Math.round(cm * 567);
}
