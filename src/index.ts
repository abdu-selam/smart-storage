import { Storage } from "./core/TypeStorage.js";

const storage = new Storage("data", "local");

console.log(storage.getAll());
