import { StorageType } from "../types/StorageTypes.js";

import {
  InvalidTypeError,
  InvalidValueError,
} from "../errors/StorageErrors.js";

export class TypeStorage {
  #storageType: StorageType;
  #data: any;

  constructor(type: StorageType) {
    if (!["local", "session"].includes(type)) {
      throw new InvalidTypeError();
    }
    this.#storageType = type;
    this.#data = this.#createStorage();
  }

  getAll(): {} | null {
    return this.#data;
  }

  set(key: string, value: any): void | never {
    if (value === undefined || typeof key !== "string") {
      throw new InvalidValueError();
    }

    this.#data[key] = value;
    this.#saveOne(key);
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
