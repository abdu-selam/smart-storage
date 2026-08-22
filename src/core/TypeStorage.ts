import { StorageType } from "../types/StorageTypes.js";

import {
  InvalidTypeError,
  InvalidValueError,
} from "../errors/StorageErrors.js";

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

  set(key: string | number, value: any): void | never {
    if (value === undefined || !["string", "number"].includes(typeof key)) {
      throw new InvalidValueError();
    }

    const keyData = typeof key === "number" ? key.toString() : key;

    this.#data[keyData] = value;
    this.#saveOne(keyData);
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
