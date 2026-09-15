export interface JsonStorageType {
  filePath: string;

  getAll: () => Promise<JsonDataType>;
  get: (key: string | number) => Promise<unknown | never>;

  set: (key: string | number, value: any) => Promise<void>;
}

export type JsonDataType = Record<string, unknown> | Array<unknown>;
