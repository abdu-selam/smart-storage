import { TypeStorage } from "./core/TypeStorage.js";

const storage = new TypeStorage("local");

storage.setAll({ name: { gore: [78, 56] }, age: 21, roll: "admin" });

console.log(storage.get("name.gore.0"));
 