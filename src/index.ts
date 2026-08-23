import { TypeStorage } from "./core/TypeStorage.js";

const storage = new TypeStorage("local");
// storage.setAll({ name: { gore: null } });

// storage.deepSet("user.name.0", "me");
// storage.set("user", "hello");

// console.log(storage.deepGet("name.gore.utt.2"));
console.log(storage.has("user.name.0")); 
// storage.clear();
