import type { JsonStorageType } from "../types/JsonStorageTypes.js";
import { createJson } from "../utils/fileHelper.js";

class JsonStorage implements JsonStorageType {
  constructor(
    public filePath: string,
    { force = true, object = true },
  ) {
    if (force) {
      createJson(filePath, object ? "{}" : "[]");
    }
  }
}
