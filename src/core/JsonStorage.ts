import type { JsonStorageType } from "../types/JsonStorageTypes.js";
import { createJson, isJson, readFile } from "../utils/fileHelper.js";

class JsonStorage implements JsonStorageType {
  constructor(
    public filePath: string,
    { force = true, object = true },
  ) {
    if (force) {
      createJson(filePath, object ? "{}" : "[]");
    }
  }

  async getAll(): Promise<Record<string, unknown>> {
    const check = isJson(this.filePath);
    if (!check) {
      throw new Error("not json");
    }

    const data = await readFile(this.filePath);

    return JSON.parse(data || "{}");
  }
}
