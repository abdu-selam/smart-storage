export interface JsonStorageType {
  filePath: string;

  getAll: () => JsonDataType;
  get: (key: string | number) => unknown | never;
}

export type JsonDataType = Record<string, unknown> | Array<unknown>;
