export interface JsonStorageType {
  filePath: string;

  getAll: () => Promise<JsonDataType>;
  get: (key: string | number) => Promise<unknown | never>;

  set: (key: string | number, value: any) => Promise<void>;
  setAll: (data: JsonDataType) => Promise<void>;

  remove: (key: string | number) => Promise<void>;
  clear: () => Promise<void>;

  keys: () => Promise<Array<string | number>>;
  length: () => Promise<number | null>;
  has: (key: string | number) => Promise<boolean>;
}

export type JsonDataType = Record<string, unknown> | Array<unknown>;
