import { TypeStorage } from "./core/TypeStorage.js";

const storage = new TypeStorage("local");

storage.setAll({ name: "Abduselam", age: 21, roll: "admin" });

console.log(storage.getAll());
