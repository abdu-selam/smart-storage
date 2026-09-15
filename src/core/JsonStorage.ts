import type {
  JsonDataType,
  JsonStorageType,
} from "../types/JsonStorageTypes.js";
import { createJson, saveJson } from "../utils/fileHelper.js";
import { isIndex } from "../utils/helper.js";

export class JsonStorage implements JsonStorageType {
  #data: JsonDataType = {};
  #constructed = false;

  constructor(public filePath: string) {}

  async getAll(): Promise<JsonDataType> {
    if (!this.#constructed) {
      await this.#dataCreator();
    }
    const data = structuredClone(this.#data);

    return data;
  }

  async get(key: string | number): Promise<unknown | never> {
    if (!this.#constructed) {
      await this.#dataCreator();
    }
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
    if (!this.#constructed) {
      await this.#dataCreator();
    }
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

  async #dataCreator(): Promise<void> {
    const res = await createJson(this.filePath, "{}");
    const data = JSON.parse(res);

    this.#data = data;
    this.#constructed = true;
  }
}
