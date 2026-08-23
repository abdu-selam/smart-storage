import { TypeStorage } from "./core/TypeStorage.js";

const storage = new TypeStorage("local");
// storage.setAll({ name: { gore: null } });
 
storage.deepSet("name.gore.utt.2", "me");
storage.set("name.gore.utt.1", "you");

console.log(storage.deepGet("name.gore.utt.2"));
// storage.clear();
