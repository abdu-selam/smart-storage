import { StorageType } from "../types/StorageTypes.js";

import {
  ConstructionError,
  InvalidDataError,
  InvalidKeyError,
  InvalidValueError,
} from "../errors/StorageErrors.js";
import { isObject } from "../utils/helper.js";

export class TypeStorage {
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
    return this.#data;
  }

  get(key: string | number): any | never | null {
    if (!["string", "number"].includes(typeof key)) {
      throw new InvalidKeyError();
    }

    const keyData = typeof key === "number" ? key.toString() : key;

    if (this.#checkKeyExtraction(keyData)) {
      return this.deepGet(keyData);
    }

    const hasKey = Object.keys(this.#data).includes(keyData);
    if (!hasKey) return null;

    return this.#data[keyData];
  }

  deepGet(key: string | number): any | never | null {
    if (!["string", "number"].includes(typeof key)) {
      throw new InvalidKeyError();
    }

    const keyData = typeof key === "number" ? key.toString() : key;

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

  set(key: string | number, value: any): void | never {
    if (!["string", "number"].includes(typeof key)) {
      throw new InvalidKeyError();
    }

    if (value === undefined) {
      throw new InvalidValueError();
    }

    const keyData = typeof key === "number" ? key.toString() : key;

    this.#data[keyData] = value;
    this.#saveOne(keyData);
  }

  deepSet(key: string | number, value: unknown): void | never {
    if (!["string", "number"].includes(typeof key)) {
      throw new InvalidKeyError();
    }

    if (value === undefined) {
      throw new InvalidValueError();
    }

    const keyData = typeof key === "number" ? key.toString() : key;

    const each = keyData.split(".");

    if (each.length === 0) {
      return;
    }

    const rootKey = each[0];

    if (each.length === 1) {
      this.#data[rootKey] = value;
      return;
    }

    let data: any = this.#data;

    for (let i = 0; i < each.length - 1; i++) {
      const current = each[i];
      const next = each[i + 1];

      const currentIsIndex = Number.isInteger(Number(current));
      const nextIsIndex = Number.isInteger(Number(next));

      if (currentIsIndex) {
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
    const lastIsIndex = Number.isInteger(Number(lastKey));

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

  setAll(data: Record<string, unknown>): void | never {
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
    if (this.#storageType === "local") {
      localStorage.removeItem(keyData);
    } else {
      sessionStorage.removeItem(keyData);
    }
  }

  clear(): void {
    if (this.#storageType === "local") {
      localStorage.clear();
    } else {
      sessionStorage.clear();
    }
  }

  keys(): Array<string> {
    const data = Object.keys(this.#data);

    return [...data];
  }

  isKeyExist(key: string | number): boolean {
    const data = Object.keys(this.#data);

    if (!["string", "number"].includes(typeof key)) {
      throw new InvalidKeyError();
    }

    const keyData = typeof key === "number" ? key.toString() : key;
    return data.includes(keyData);
  }

  #checkKeyExtraction(key: string): boolean {
    if (this.isKeyExist(key)) {
      return false;
    }

    return key.includes(".");
  }

  #saveOne(key: string): void {
    const data =
      typeof this.#data[key] === "string"
        ? this.#data[key]
        : JSON.stringify(this.#data[key]);

    if (this.#storageType === "local") {
      localStorage.setItem(key, data);
    } else {
      sessionStorage.setItem(key, data);
    }
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
    if (this.#storageType === "local") {
      return this.#getAllData(localStorage);
    } else {
      return this.#getAllData(sessionStorage);
    }
  }
}
