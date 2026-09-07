export type StorageType = "local" | "session";

export type UpdateCallback = (current: any) => any;

export interface BrowserStorageType {
  getAll: () => Record<string, unknown>;
  get: (key: string | number) => unknown | never;
  deepGet: (key: string | number) => unknown | never;

  set: (key: string | number, value: any) => void;
  deepSet: (key: string | number, value: unknown) => void;
  update: (key: string | number, callback: UpdateCallback) => void;
  setAll: (data: Record<string, unknown>) => void;

  remove: (key: string | number) => void;
  clear: () => void;

  keys: () => Array<string>;
  has: (key: string | number) => boolean | never;
}
