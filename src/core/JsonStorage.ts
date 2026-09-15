import type {
  JsonDataType,
  JsonStorageType,
} from "../types/JsonStorageTypes.js";
import { createJson, saveJson } from "../utils/fileHelper.js";
import { isIndex, isObject } from "../utils/helper.js";

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

    return structuredClone(this.#data[key]);
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

      this.#data[Number(key)] = structuredClone(value);
      return;
    }

    this.#data[`${key}`] = structuredClone(value);
    await saveJson(this.filePath, this.#data);
  }

  async setAll(data: JsonDataType): Promise<void> {
    if (!this.#constructed) {
      await this.#dataCreator();
    }

    if (!isObject(data) && !Array.isArray(data)) {
      throw new Error("");
    }

    this.#data = structuredClone(data);
    await saveJson(this.filePath, this.#data);
  }

  async remove(key: number | string): Promise<void> {
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

      this.#data = this.#data.filter((item, i: number) => i !== Number(key));
    } else {
      delete this.#data[key];
    }

    await saveJson(this.filePath, this.#data);
  }

  async clear(): Promise<void> {
    if (!this.#constructed) {
      await this.#dataCreator();
    }

    this.#data = Array.isArray(this.#data) ? [] : {};

    await saveJson(this.filePath, this.#data);
  }

  async keys(): Promise<Array<string | number>> {
    if (!this.#constructed) {
      await this.#dataCreator();
    }

    if (Array.isArray(this.#data)) {
      return this.#data.map((item, i) => i);
    }

    return [...Object.keys(this.#data)];
  }

  async length(): Promise<number | null> {
    if (!this.#constructed) {
      await this.#dataCreator();
    }

    if (Array.isArray(this.#data)) {
      return this.#data.length;
    }

    return null;
  }

  async has(key: string | number): Promise<boolean> {
    if (!this.#constructed) {
      await this.#dataCreator();
    }

    if (!["string", "number"].includes(typeof key)) {
      throw new Error();
    }

    if (Array.isArray(this.#data)) {
      if (!isIndex(key)) {
        return false;
      }

      const index = Number(key);
      return this.#data.length > index && index > -1;
    }

    const keys = await this.keys();
    return keys.includes(`${key}`);
  }

  async #dataCreator(): Promise<void> {
    const res = await createJson(this.filePath, "{}");
    const data = JSON.parse(res);

    this.#data = data;
    this.#constructed = true;
  }
}
