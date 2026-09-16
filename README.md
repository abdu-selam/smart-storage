# Smart Storage

A lightweight TypeScript storage utility with a simple, consistent API for working with:

- Browser `localStorage`
- Browser `sessionStorage`
- JSON files in Node.js

It supports regular and deeply nested data access, updates through callbacks, key management, and JSON file persistence.

## Features

- TypeScript-first API with type declarations
- ESM and CommonJS support
- `localStorage` and `sessionStorage` support
- JSON file storage for Node.js
- Get and set individual values
- Get and set deeply nested objects and arrays with dot notation
- Update values with callback functions
- Set or retrieve multiple values
- Check whether keys or nested paths exist
- Remove individual values
- Clear stored data
- JSON file validation with `isJson()`
- Automatic creation of a JSON file when using `JsonStorage`

## Installation

```bash
npm install @abdu-selam/smart-storage
```

## Browser Storage

`BrowserStorage` provides a wrapper around the browser's native `localStorage` and `sessionStorage` APIs.

### Import

```ts
import { BrowserStorage } from "@abdu-selam/smart-storage";
```

### Create a storage instance

For `localStorage`:

```ts
const storage = new BrowserStorage("local");
```

For `sessionStorage`:

```ts
const storage = new BrowserStorage("session");
```

The constructor accepts:

```ts
"local" | "session"
```

### Set and get values

```ts
storage.set("username", "Abdu");

const username = storage.get("username");

console.log(username);
// "Abdu"
```

If a key does not exist, `get()` returns `null`.

Numeric keys are also supported:

```ts
storage.set(1, "Hello");

console.log(storage.get(1));
// "Hello"
```

### Get all values

```ts
const data = storage.getAll();

console.log(data);
```

`getAll()` returns a cloned copy of the current storage data.

### Deep get

Use `deepGet()` to access values inside nested objects or arrays.

```ts
storage.set("user", {
  name: "Abdu",
  profile: {
    age: 22
  }
});

const age = storage.deepGet("user.profile.age");

console.log(age);
// 22
```

Array indexes are supported:

```ts
storage.set("users", [
  { name: "Abdu" },
  { name: "John" }
]);

console.log(storage.deepGet("users.0.name"));
// "Abdu"
```

### Deep set

Use `deepSet()` to create or modify nested values.

```ts
storage.deepSet("user.profile.name", "Abdu");
```

Array indexes are supported as well:

```ts
storage.deepSet("users.0.name", "Abdu");
```

If the required nested structure does not exist, `deepSet()` creates the required objects or arrays.

### Update values

`update()` receives the current value and stores the value returned by the callback.

```ts
storage.set("counter", 10);

storage.update("counter", (current) => current + 1);

console.log(storage.get("counter"));
// 11
```

Nested values can also be updated:

```ts
storage.set("user", {
  name: "Abdu",
  age: 21
});

storage.update("user.age", (age) => age + 1);

console.log(storage.deepGet("user.age"));
// 22
```

### Set multiple values

```ts
storage.setAll({
  username: "Abdu",
  age: 22,
  role: "developer"
});
```

### Check for a key

```ts
console.log(storage.has("username"));
// true
```

Nested paths are supported:

```ts
console.log(storage.has("user.profile.age"));
// true
```

Array indexes are supported:

```ts
console.log(storage.has("users.0.name"));
// true
```

### Get all keys

```ts
const keys = storage.keys();

console.log(keys);
```

Example:

```ts
["username", "age", "role"]
```

### Remove a value

```ts
storage.remove("username");
```

Numeric keys are supported:

```ts
storage.remove(1);
```

### Clear storage

`clear()` removes all data from the selected browser storage.

```ts
storage.clear();
```

This clears either `localStorage` or `sessionStorage`, depending on how the instance was created.

---

## JSON File Storage

`JsonStorage` provides an asynchronous API for storing data in JSON files and is intended for Node.js environments.

### Import

```ts
import { JsonStorage } from "@abdu-selam/smart-storage";
```

### Create a JSON storage instance

```ts
const storage = new JsonStorage("./data.json");
```

If the file does not exist or is not a valid JSON file, the storage initializes it with an empty object.

### Set and get values

```ts
await storage.set("username", "Abdu");

const username = await storage.get("username");

console.log(username);
// "Abdu"
```

### Get all data

```ts
const data = await storage.getAll();

console.log(data);
```

### Deep get

```ts
await storage.set("user", {
  name: "Abdu",
  profile: {
    age: 22
  }
});

const age = await storage.deepGet("user.profile.age");

console.log(age);
// 22
```

Arrays are supported:

```ts
await storage.set("users", [
  { name: "Abdu" },
  { name: "John" }
]);

console.log(await storage.deepGet("users.0.name"));
// "Abdu"
```

### Deep set

```ts
await storage.deepSet("user.profile.name", "Abdu");
```

Nested arrays are also supported:

```ts
await storage.deepSet("users.0.name", "Abdu");
```

### Update values

```ts
await storage.set("counter", 10);

await storage.update("counter", (current) => current + 1);

console.log(await storage.get("counter"));
// 11
```

### Set multiple values

```ts
await storage.setAll({
  username: "Abdu",
  age: 22,
  role: "developer"
});
```

`setAll()` accepts either an object or an array.

### Check for a key

```ts
const exists = await storage.has("username");

console.log(exists);
// true
```

Nested paths are supported:

```ts
const exists = await storage.has("user.profile.age");
```

### Get keys

```ts
const keys = await storage.keys();

console.log(keys);
```

For object data:

```ts
["username", "age", "role"]
```

For array data:

```ts
[0, 1, 2]
```

### Get array length

`length()` returns the length when the root JSON value is an array.

```ts
const length = await storage.length();

console.log(length);
// 3
```

For a root object, it returns `null`.

### Remove data

```ts
await storage.remove("username");
```

For a root array, provide an array index:

```ts
await storage.remove(0);
```

### Clear the JSON file

```ts
await storage.clear();
```

The root value becomes an empty object or empty array, depending on the current root data type.

### Check whether a file is valid JSON

You can check an instance:

```ts
const valid = await storage.isJson();

console.log(valid);
```

You can also use the static method without creating an instance:

```ts
const valid = await JsonStorage.isJson("./data.json");

console.log(valid);
```

---

## API Reference

### `BrowserStorage`

| Method | Return type | Description |
|---|---|---|
| `getAll()` | `Record<string, unknown>` | Returns all stored data |
| `get(key)` | `unknown \| null` | Gets a value by key |
| `deepGet(key)` | `unknown \| null` | Gets a nested value using dot notation |
| `set(key, value)` | `void` | Stores a value |
| `deepSet(key, value)` | `void` | Sets a nested value |
| `update(key, callback)` | `void` | Updates a value using a callback |
| `setAll(data)` | `void` | Stores multiple values |
| `remove(key)` | `void` | Removes a value |
| `clear()` | `void` | Clears the selected browser storage |
| `keys()` | `string[]` | Returns top-level keys |
| `has(key)` | `boolean` | Checks whether a key or nested path exists |

### `JsonStorage`

| Method | Return type | Description |
|---|---|---|
| `getAll()` | `Promise<JsonDataType>` | Returns all JSON data |
| `get(key)` | `Promise<unknown>` | Gets a value by key |
| `deepGet(key)` | `Promise<unknown>` | Gets a nested value |
| `set(key, value)` | `Promise<void>` | Stores a value |
| `deepSet(key, value)` | `Promise<void>` | Sets a nested value |
| `update(key, callback)` | `Promise<void>` | Updates a value using a callback |
| `setAll(data)` | `Promise<void>` | Replaces the stored data |
| `remove(key)` | `Promise<void>` | Removes a value or array item |
| `clear()` | `Promise<void>` | Clears the JSON data |
| `keys()` | `Promise<(string \| number)[]>` | Returns object keys or array indexes |
| `length()` | `Promise<number \| null>` | Returns root array length |
| `has(key)` | `Promise<boolean>` | Checks whether a key or nested path exists |
| `isJson()` | `Promise<boolean>` | Checks whether the storage file is valid JSON |

## Error Handling

The package includes custom errors for invalid input:

### `ConstructionError`

Thrown when `BrowserStorage` receives an invalid storage type.

```ts
new BrowserStorage("invalid");
```

Valid values are:

```ts
"local"
"session"
```

### `InvalidKeyError`

Thrown when a key is not a string or number, or when an invalid key is used with array storage.

### `InvalidValueError`

Thrown when `undefined` is passed to operations that require a value.

### `InvalidDataError`

Thrown when invalid data is passed to `setAll()`.

### `InvalidFunctionError`

Thrown when the callback passed to `update()` is not a function.

## Browser and Node.js Support

### Browser

Use `BrowserStorage` in environments that provide the Web Storage API:

- `localStorage`
- `sessionStorage`

```ts
const storage = new BrowserStorage("local");
```

### Node.js

Use `JsonStorage` for JSON file persistence:

```ts
const storage = new JsonStorage("./data.json");
```

`JsonStorage` uses Node.js file-system APIs and should not be used directly in a browser environment.

## TypeScript

The package is written in TypeScript and includes generated type declarations.

You can import the provided types when needed:

```ts
import type {
  StorageType,
  UpdateCallback,
  JsonStorageType,
  JsonDataType
} from "@abdu-selam/smart-storage";
```

## ESM and CommonJS

The package provides both ESM and CommonJS builds.

ESM:

```ts
import { BrowserStorage, JsonStorage } from "@abdu-selam/smart-storage";
```

CommonJS:

```js
const {
  BrowserStorage,
  JsonStorage
} = require("@abdu-selam/smart-storage");
```

## Important Notes

- `BrowserStorage` depends on the browser's native Storage API.
- `JsonStorage` performs asynchronous file operations, so its methods must be awaited.
- `BrowserStorage` and `JsonStorage` are separate storage implementations; choose the one that matches your runtime.
- Nested paths use dot notation, for example `user.profile.name` and `users.0.name`.
- JSON file writes are formatted with two-space indentation.

## Contributing

Issues, feature requests, bug reports, and pull requests are welcome.

Repository:

https://github.com/abdu-selam/smart-storage

Issues:

https://github.com/abdu-selam/smart-storage/issues

## License

MIT © Abduselam Awel
