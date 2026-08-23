import { TypeStorage } from "./core/TypeStorage.js";

const storage = new TypeStorage("local");
// storage.setAll({ name: { gore: null } });
 
storage.set("name.gore.utt.1", "you");

console.log(storage.getAll());
storage.clear();
