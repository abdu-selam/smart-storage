export interface JsonStorageType {
  filePath: string;

  getAll: () => JsonDataType;
  get: (key: string | number) => unknown | never;

  set: (key: string | number, value: any) => Promise<void>;
}

export type JsonDataType = Record<string, unknown> | Array<unknown>;
