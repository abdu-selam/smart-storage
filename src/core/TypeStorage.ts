import { StorageType } from "../types/StorageTypes.js";

import {
  InvalidNameError,
  InvalidTypeError,
} from "../errors/StorageErrors.js";

export class Storage {
  #storageName: string;
  #storageType: StorageType;
  #data: any;

  constructor(name: string, type: StorageType) {
    if (typeof name !== "string" || name.trim() === "") {
      throw new InvalidNameError();
    }

    if (!["local", "session"].includes(type)) {
      throw new InvalidTypeError();
    }

    this.#storageName = name;
    this.#storageType = type;
    this.#data = this.#createStorage(name);
  }

  getAll(): {} | null {
    return this.#data;
  }

  #createStorage(name: string): Record<string, unknown> | null {
    let item: string | null = null;
    if (this.#storageType === "local") {
      item = localStorage.getItem(name);
    } else {
      item = sessionStorage.getItem(name);
    }

    if (item === null) {
      if (this.#storageType === "local") {
        localStorage.setItem(name, JSON.stringify({}));
      } else {
        sessionStorage.setItem(name, JSON.stringify({}));
      }
      return null;
    }

    return JSON.parse(item);
  }
}
