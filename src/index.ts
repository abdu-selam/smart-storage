import path from "node:path";
import { JsonStorage } from "./core/JsonStorage.js";

export { BrowserStorage } from "./core/BrowserStorage.js";

export type { StorageType, UpdateCallback } from "./types/StorageTypes.js";

const storage = new JsonStorage(path.join(process.cwd(), "data.json"));

storage.clear()