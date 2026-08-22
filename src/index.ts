import { TypeStorage } from "./core/TypeStorage.js";

const storage = new TypeStorage("local");

storage.set("name", "abduselam");

console.log(storage.getAll());
