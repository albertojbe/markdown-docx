export interface MetadataField<T> {
  value: T;
  enabled: boolean;
}

export interface DocxMetadata {
  title: MetadataField<string>;
  subtitle: MetadataField<string>;
  author: MetadataField<string>;
  date: MetadataField<string>;
  version: MetadataField<string>;
  organization: MetadataField<string>;
  keywords: MetadataField<string>;
}

export interface DocxSettings {
  mainFont: string;
  monoFont: string;
  colorH1: string;
  colorH2: string;
  colorH3: string;
  colorH4: string;
  codeBgColor: string;
  codeFontColor: string;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  showCoverPage: boolean;
  showHeaderFooter: boolean;
}

export const DEFAULT_METADATA: DocxMetadata = {
  title: { value: "", enabled: true },
  subtitle: { value: "", enabled: false },
  author: { value: "", enabled: false },
  date: { value: "", enabled: false },
  version: { value: "", enabled: false },
  organization: { value: "", enabled: false },
  keywords: { value: "", enabled: false },
};

export const DEFAULT_SETTINGS: DocxSettings = {
  mainFont: "Calibri",
  monoFont: "Courier New",
  colorH1: "#1F497D",
  colorH2: "#2E75B6",
  colorH3: "#2E75B6",
  colorH4: "#404040",
  codeBgColor: "#F2F2F2",
  codeFontColor: "#C7254E",
  marginTop: 2.5,
  marginBottom: 2.5,
  marginLeft: 3.0,
  marginRight: 2.5,
  showCoverPage: true,
  showHeaderFooter: true,
};
