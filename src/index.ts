import { TypeStorage } from "./core/TypeStorage.js";

const storage = new TypeStorage("local");

storage.set(2, "abduselam");

console.log(storage.get(2));
