export interface JsonStorageType {
  filePath: string;

  getAll: () => Promise<Record<string, unknown>>;
}
