import type {
  JsonDataType,
  JsonStorageType,
} from "../types/JsonStorageTypes.js";
import { createJson, saveJson } from "../utils/fileHelper.js";
import { isIndex } from "../utils/helper.js";

export class JsonStorage implements JsonStorageType {
  #data: JsonDataType = {};
  #constructed = false;

  constructor(public filePath: string) {
    createJson(filePath, "{}").then((res) => {
      const data = JSON.parse(res);
      this.#data = data;
      this.#constructed = true;
    });
  }

  getAll(): JsonDataType {
    const data = structuredClone(this.#data);

    return data;
  }

  get(key: string | number): unknown | never {
    if (!["string", "number"].includes(typeof key)) {
      throw new Error();
    }

    if (Array.isArray(this.#data)) {
      if (!isIndex(key)) {
        throw new Error();
      }

      return this.#data[Number(key)];
    }

    return this.#data[key];
  }

  async set(key: string | number, value: any): Promise<void> {
    if (!["string", "number"].includes(typeof key)) {
      throw new Error();
    }

    if (Array.isArray(this.#data)) {
      if (!isIndex(key)) {
        throw new Error();
      }

      this.#data[Number(key)] = value;
      return;
    }

    this.#data[`${key}`] = value;
    await saveJson(this.filePath, this.#data);
  }
}
