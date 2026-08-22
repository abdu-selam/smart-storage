import { TypeStorage } from "./core/TypeStorage.js";

const storage = new TypeStorage("local");
storage.setAll({});

console.log(storage.get("name.gore.0"));
