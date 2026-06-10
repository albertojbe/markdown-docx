"use client";

import type { DocxMetadata, DocxSettings } from "@/app/lib/types";

type MetadataField = { value: string; enabled: boolean };

type SettingsPanelProps = {
  metadata: DocxMetadata;
  settings: DocxSettings;
  onMetadataChange: (metadata: DocxMetadata) => void;
  onSettingsChange: (settings: DocxSettings) => void;
};

function MetadataInput({
  label,
  field,
  type = "text",
  onChange,
}: {
  label: string;
  field: MetadataField;
  type?: string;
  onChange: (field: MetadataField) => void;
}) {
  return (
    <div className="metadata-row">
      <label className="metadata-checkbox">
        <input
          type="checkbox"
          checked={field.enabled}
          onChange={(e) =>
            onChange({ ...field, enabled: e.target.checked })
          }
        />
        <span>{label}</span>
      </label>
      <input
        type={type}
        className="metadata-input"
        value={field.value}
        disabled={!field.enabled}
        onChange={(e) => onChange({ ...field, value: e.target.value })}
        placeholder={label}
      />
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="color-row">
      <label className="color-label">{label}</label>
      <div className="color-input-wrapper">
        <input
          type="color"
          className="color-picker"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="color-hex">{value}</span>
      </div>
    </div>
  );
}

function NumberInput({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="number-row">
      <label className="number-label">{label}</label>
      <div className="number-input-wrapper">
        <input
          type="number"
          className="number-input"
          value={value}
          step={0.1}
          min={0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
        <span className="number-unit">{unit}</span>
      </div>
    </div>
  );
}

export function SettingsPanel({
  metadata,
  settings,
  onMetadataChange,
  onSettingsChange,
}: SettingsPanelProps) {
  const updateMeta = (key: keyof DocxMetadata, field: MetadataField) => {
    onMetadataChange({ ...metadata, [key]: field });
  };

  const updateSetting = <K extends keyof DocxSettings>(
    key: K,
    value: DocxSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="settings-panel">
      <section className="settings-section">
        <h3 className="settings-section-title">Metadados</h3>
        <p className="settings-section-desc">
          Campos habilitados aparecem no documento (capa, cabeçalho, rodapé).
        </p>

        <MetadataInput
          label="Título"
          field={metadata.title}
          onChange={(f) => updateMeta("title", f)}
        />
        <MetadataInput
          label="Subtítulo"
          field={metadata.subtitle}
          onChange={(f) => updateMeta("subtitle", f)}
        />
        <MetadataInput
          label="Autor"
          field={metadata.author}
          onChange={(f) => updateMeta("author", f)}
        />
        <MetadataInput
          label="Data"
          field={metadata.date}
          type="date"
          onChange={(f) => updateMeta("date", f)}
        />
        <MetadataInput
          label="Versão"
          field={metadata.version}
          onChange={(f) => updateMeta("version", f)}
        />
        <MetadataInput
          label="Organização"
          field={metadata.organization}
          onChange={(f) => updateMeta("organization", f)}
        />
        <MetadataInput
          label="Palavras-chave"
          field={metadata.keywords}
          onChange={(f) => updateMeta("keywords", f)}
        />
      </section>

      <section className="settings-section">
        <h3 className="settings-section-title">Fontes</h3>
        <div className="font-row">
          <label className="font-label">Fonte principal</label>
          <input
            type="text"
            className="font-input"
            value={settings.mainFont}
            onChange={(e) => updateSetting("mainFont", e.target.value)}
          />
        </div>
        <div className="font-row">
          <label className="font-label">Fonte monoespaçada</label>
          <input
            type="text"
            className="font-input"
            value={settings.monoFont}
            onChange={(e) => updateSetting("monoFont", e.target.value)}
          />
        </div>
      </section>

      <section className="settings-section">
        <h3 className="settings-section-title">Cores</h3>
        <ColorInput
          label="Título H1"
          value={settings.colorH1}
          onChange={(v) => updateSetting("colorH1", v)}
        />
        <ColorInput
          label="Título H2"
          value={settings.colorH2}
          onChange={(v) => updateSetting("colorH2", v)}
        />
        <ColorInput
          label="Título H3"
          value={settings.colorH3}
          onChange={(v) => updateSetting("colorH3", v)}
        />
        <ColorInput
          label="Título H4"
          value={settings.colorH4}
          onChange={(v) => updateSetting("colorH4", v)}
        />
        <ColorInput
          label="Fundo bloco de código"
          value={settings.codeBgColor}
          onChange={(v) => updateSetting("codeBgColor", v)}
        />
        <ColorInput
          label="Cor código inline"
          value={settings.codeFontColor}
          onChange={(v) => updateSetting("codeFontColor", v)}
        />
      </section>

      <section className="settings-section">
        <h3 className="settings-section-title">Layout</h3>
        <NumberInput
          label="Margem superior"
          value={settings.marginTop}
          unit="cm"
          onChange={(v) => updateSetting("marginTop", v)}
        />
        <NumberInput
          label="Margem inferior"
          value={settings.marginBottom}
          unit="cm"
          onChange={(v) => updateSetting("marginBottom", v)}
        />
        <NumberInput
          label="Margem esquerda"
          value={settings.marginLeft}
          unit="cm"
          onChange={(v) => updateSetting("marginLeft", v)}
        />
        <NumberInput
          label="Margem direita"
          value={settings.marginRight}
          unit="cm"
          onChange={(v) => updateSetting("marginRight", v)}
        />

        <div className="toggle-row">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.showCoverPage}
              onChange={(e) =>
                updateSetting("showCoverPage", e.target.checked)
              }
            />
            <span>Gerar página de capa</span>
          </label>
        </div>
        <div className="toggle-row">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.showHeaderFooter}
              onChange={(e) =>
                updateSetting("showHeaderFooter", e.target.checked)
              }
            />
            <span>Mostrar cabeçalho e rodapé</span>
          </label>
        </div>
      </section>
    </div>
  );
}
