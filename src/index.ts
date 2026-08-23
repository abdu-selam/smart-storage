import { BrowserStorage } from "./core/BrowserStorage.js";

const storage = new BrowserStorage("local");
// storage.setAll({ name: { gore: null } });

// storage.deepSet("user.name.0", "me");
// storage.set("user", "hello");
// storage.update("user", () => "");

console.log(storage.getAll());

// console.log(storage.deepGet("name.gore.utt.2"));
// console.log(storage.has("user.name.0"));
// storage.clear();
