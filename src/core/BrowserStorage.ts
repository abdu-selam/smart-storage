import { StorageType, UpdateCallback } from "../types/StorageTypes.js";

import {
  ConstructionError,
  InvalidDataError,
  InvalidKeyError,
  InvalidValueError,
} from "../errors/StorageErrors.js";
import { isIndex, isObject } from "../utils/helper.js";

export class BrowserStorage {
  #storageType: StorageType;
  #data: Record<string, unknown>;

  constructor(type: StorageType) {
    if (!["local", "session"].includes(type)) {
      throw new ConstructionError();
    }
    this.#storageType = type;
    this.#data = this.#createStorage();
  }

  getAll(): Record<string, unknown> {
    return structuredClone(this.#data);
  }

  get(key: string | number): unknown | never {
    const keyData = this.#getKeyExtract(key);

    const hasKey = this.keys().includes(keyData);
    if (!hasKey) return null;

    return this.#data[keyData];
  }

  deepGet(key: string | number): unknown | never {
    const keyData = this.#getKeyExtract(key);

    const each: Array<string> = keyData.split(".");
    let data: any = null;

    for (let i = 0; i < each.length; i++) {
      if (i === 0) {
        data = this.get(each[i]);
        continue;
      }

      if (!isObject(data) && !Array.isArray(data)) {
        data = null;
        break;
      }

      if (!Object.keys(data).includes(each[i])) {
        data = null;
        break;
      }

      const index = Number(each[i]);

      if (Array.isArray(data) && !Number.isNaN(index)) {
        data = data[index];
      } else {
        data = data[each[i]];
      }
    }

    return data;
  }

  set(key: string | number, value: any): void {
    const keyData: string = this.#setKeyExtract(key, value);

    this.#data[keyData] = value;
    this.#saveOne(keyData);
  }

  deepSet(key: string | number, value: unknown): void {
    const keyData: string = this.#setKeyExtract(key, value);
    const each: Array<string> = keyData.split(".");

    if (each.length === 0) {
      return;
    }

    const rootKey = each[0];

    if (each.length === 1) {
      this.#data[rootKey] = value;
      this.#saveOne(rootKey);
      return;
    }

    let data: any = this.#data;

    for (let i = 0; i < each.length - 1; i++) {
      const current = each[i];
      const next = each[i + 1];

      const currentIsIndex = isIndex(current);
      const nextIsIndex = isIndex(next);

      if (currentIsIndex && i !== 0) {
        if (!Array.isArray(data)) {
          data = [];
        }
      } else {
        if (!isObject(data)) {
          data = {};
        }
      }

      if (currentIsIndex) {
        const index = Number(current);

        if (!isObject(data[index]) && !Array.isArray(data[index])) {
          data[index] = nextIsIndex ? [] : {};
        }

        if (nextIsIndex && !Array.isArray(data[index])) {
          data[index] = [];
        }

        if (!nextIsIndex && !isObject(data[index])) {
          data[index] = {};
        }

        data = data[index];
      } else {
        if (!isObject(data[current]) && !Array.isArray(data[current])) {
          data[current] = nextIsIndex ? [] : {};
        }

        if (!nextIsIndex && Array.isArray(data[current])) {
          data[current] = {};
        }

        if (nextIsIndex && !Array.isArray(data[current])) {
          data[current] = [];
        }

        data = data[current];
      }
    }

    const lastKey = each[each.length - 1];
    const lastIsIndex = isIndex(lastKey);

    if (lastIsIndex) {
      if (!Array.isArray(data)) {
        return;
      }

      data[Number(lastKey)] = value;
    } else {
      if (!isObject(data)) {
        return;
      }

      data[lastKey] = value;
    }

    this.#saveOne(rootKey);
  }

  update(key: string | number, callback: UpdateCallback): void {
    const keyData = this.#getKeyExtract(key);

    const input = this.deepGet(keyData);
    const callbackResult = callback(input);

    this.deepSet(keyData, callbackResult);
  }

  #setKeyExtract(key: string | number, value: unknown): string | never {
    if (!["string", "number"].includes(typeof key)) {
      throw new InvalidKeyError();
    }

    if (value === undefined) {
      throw new InvalidValueError();
    }

    const keyData = typeof key === "number" ? key.toString() : key;

    return keyData;
  }

  #getKeyExtract(key: string | number): string | never {
    if (!["string", "number"].includes(typeof key)) {
      throw new InvalidKeyError();
    }

    const keyData = typeof key === "number" ? key.toString() : key;
    return keyData;
  }

  setAll(data: Record<string, unknown>): void {
    if (!isObject(data)) {
      throw new InvalidDataError();
    }

    const keys = Object.keys(data);
    keys.forEach((key) => {
      const value = data[key];
      this.#data[key] = value;
      this.#saveOne(key);
    });
  }

  remove(key: string | number): void {
    if (!["string", "number"].includes(typeof key)) {
      throw new InvalidKeyError();
    }

    const keyData = typeof key === "number" ? key.toString() : key;
    this.#getStorage().removeItem(keyData);

    delete this.#data[keyData];
  }

  clear(): void {
    this.#getStorage().clear();

    this.#data = {};
  }

  keys(): Array<string> {
    const data = Object.keys(this.#data);

    return [...data];
  }

  has(key: string | number): boolean | never {
    const data = Object.keys(this.#data);
    const keyData = this.#getKeyExtract(key);

    if (this.#checkKeyExtraction(keyData)) {
      return this.#deepHas(keyData);
    }

    return data.includes(keyData);
  }

  #deepHas(key: string): boolean {
    const each: Array<string> = key.split(".");
    if (each.length === 0) {
      return false;
    }

    const rootKey = each[0];

    if (each.length === 1) {
      return this.keys().includes(rootKey);
    }

    let data: any = this.#data[each[0]];

    for (let i = 1; i < each.length - 1; i++) {
      if (!isObject(data) && !Array.isArray(data)) {
        return false;
      }

      const index = Number(each[i]);
      if (isObject(data) && !Object.keys(data).includes(each[i])) {
        return false;
      } else if (Array.isArray(data)) {
        if (!isIndex(each[i])) {
          return false;
        }

        if (index >= data.length) {
          return false;
        }
      }

      if (Array.isArray(data) && isIndex(each[i])) {
        data = data[index];
      } else {
        data = data[each[i]];
      }
    }

    const lastKey = each[each.length - 1];
    const lastIsIndex = isIndex(lastKey);

    if (Array.isArray(data)) {
      return lastIsIndex && Number(lastKey) < data.length;
    }

    return Object.keys(data).includes(lastKey);
  }

  #checkKeyExtraction(key: string): boolean {
    if (Object.keys(this.#data).includes(key)) {
      return false;
    }

    return key.includes(".");
  }

  #getStorage(): Storage {
    return this.#storageType === "local" ? localStorage : sessionStorage;
  }

  #saveOne(key: string): void {
    const data =
      typeof this.#data[key] === "string"
        ? this.#data[key]
        : JSON.stringify(this.#data[key]);

    this.#getStorage().setItem(key, data);
  }

  #getAllData(storage: Storage): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);

      if (key !== null) {
        let value = null;
        try {
          value = JSON.parse(storage.getItem(key) ?? "null");
        } catch (error) {
          value = storage.getItem(key);
        }
        data[key] = value;
      }
    }

    return data;
  }

  #createStorage(): Record<string, unknown> {
    return this.#getAllData(this.#getStorage());
  }
}
