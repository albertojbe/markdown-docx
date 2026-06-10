"use client";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="editor-container">
      <textarea
        className="markdown-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escreva seu Markdown aqui..."
        spellCheck={false}
      />
    </div>
  );
}
