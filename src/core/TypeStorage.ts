import { StorageType } from "../types/StorageTypes.js";

import {
  InvalidTypeError,
  InvalidValueError,
} from "../errors/StorageErrors.js";
import { isObject } from "../utils/helper.js";

export class TypeStorage {
  #storageType: StorageType;
  #data: Record<string, unknown>;

  constructor(type: StorageType) {
    if (!["local", "session"].includes(type)) {
      throw new InvalidTypeError();
    }
    this.#storageType = type;
    this.#data = this.#createStorage();
  }

  getAll(): Record<string, unknown> {
    return this.#data;
  }

  get(key: string | number): any | never | null {
    if (!["string", "number"].includes(typeof key)) {
      throw new InvalidValueError();
    }

    const keyData = typeof key === "number" ? key.toString() : key;

    const hasKey = Object.keys(this.#data).includes(keyData);
    if (!hasKey) return null;

    return this.#data[keyData];
  }

  set(key: string | number, value: any): void | never {
    if (value === undefined || !["string", "number"].includes(typeof key)) {
      throw new InvalidValueError();
    }

    const keyData = typeof key === "number" ? key.toString() : key;

    this.#data[keyData] = value;
    this.#saveOne(keyData);
  }

  setAll(data: Record<string, unknown>): void | never {
    if (!isObject(data)) {
      throw new InvalidTypeError();
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
      throw new InvalidValueError();
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
      throw new InvalidValueError();
    }

    const keyData = typeof key === "number" ? key.toString() : key;
    return data.includes(keyData);
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
        data[key] = storage.getItem(key);
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
