# Smart Storage

A simple and powerful TypeScript storage API for working with the browser's `localStorage` and `sessionStorage`.

`smart-storage` provides a convenient object-oriented API for storing, retrieving, updating, and managing browser storage data, including deeply nested objects and arrays.

## Features

* Simple and intuitive API
* Supports both `localStorage` and `sessionStorage`
* Get and manage individual values
* Deep access to nested objects and arrays
* Update values using callbacks
* Check available keys
* Remove individual values or clear storage
* Written in TypeScript
* Includes TypeScript declarations
* Supports both ESM and CommonJS

## Installation

```bash
npm install @abdu-selam/smart-storage
```

## 🚀 Quick Start

Import `BrowserStorage` and specify which browser storage you want to use:

```ts
import { BrowserStorage } from "@abdu-selam/smart-storage";

const storage = new BrowserStorage("local");
```

For `sessionStorage`:

```ts
import { BrowserStorage } from "@abdu-selam/smart-storage";

const storage = new BrowserStorage("session");
```

The constructor accepts only:

```ts
"local" | "session"
```

## 💾 Set and Get Data

### Set

```ts
storage.set("username", "Abdu");
```

### Get

```ts
const username = storage.get("username");

console.log(username);
```

If the key doesn't exist, `get()` returns `null`.

### Numeric Keys

Keys can be strings or numbers:

```ts
storage.set(1, "Hello");

console.log(storage.get(1));
```

## Deep Get

`deepGet()` allows you to access values inside nested objects and arrays using dot notation.

```ts
storage.set("user", {
  name: "Abdu",
  profile: {
    age: 21
  }
});

const age = storage.deepGet("user.profile.age");

console.log(age);
```

Array indexes are also supported:

```ts
storage.set("users", [
  {
    name: "Abdu"
  },
  {
    name: "John"
  }
]);

console.log(storage.deepGet("users.0.name"));
```

## Deep Set

Use `deepSet()` to create or modify nested values.

```ts
storage.deepSet("user.profile.name", "Abdu");
```

You can also work with arrays:

```ts
storage.deepSet("users.0.name", "Abdu");
```

If the required nested structure does not exist, `deepSet()` creates the necessary objects or arrays.

## ✏️ Update Data

`update()` allows you to retrieve an existing value, modify it, and save the result.

```ts
storage.set("counter", 10);

storage.update("counter", (current) => {
  return current + 1;
});

console.log(storage.get("counter"));
// 11
```

It can also be used with deeply nested values:

```ts
storage.set("user", {
  name: "Abdu",
  age: 21
});

storage.update("user.age", (age) => {
  return age + 1;
});

console.log(storage.deepGet("user.age"));
// 22
```

## Set Multiple Values

Use `setAll()` to store multiple values at once.

```ts
storage.setAll({
  username: "Abdu",
  age: 21,
  role: "developer"
});
```

## Get All Data

Use `getAll()` to retrieve all data currently managed by the storage instance.

```ts
const data = storage.getAll();

console.log(data);
```

The returned data is cloned, so modifying the returned object does not directly modify the internal storage state.

## Keys

Use `keys()` to retrieve all available keys.

```ts
const keys = storage.keys();

console.log(keys);
```

Example:

```ts
[
  "username",
  "age",
  "role"
]
```

## ✅ Check if a Key Exists

Use `has()` to check whether a key exists.

```ts
if (storage.has("username")) {
  console.log("Username exists");
}
```

Deep paths are also supported:

```ts
storage.set("user", {
  profile: {
    name: "Abdu"
  }
});

console.log(storage.has("user.profile.name"));
// true
```

Array indexes are supported as well:

```ts
storage.set("users", [
  { name: "Abdu" }
]);

console.log(storage.has("users.0.name"));
// true
```

## Remove Data

Remove a specific key with `remove()`:

```ts
storage.remove("username");
```

Numeric keys are supported:

```ts
storage.remove(1);
```

## Clear Storage

Use `clear()` to remove all data from the selected browser storage.

```ts
storage.clear();
```

This clears either:

```text
localStorage
```

or:

```text
sessionStorage
```

depending on how the `BrowserStorage` instance was created.

## Error Handling

The package provides custom errors for invalid input.

### `ConstructionError`

Thrown when an invalid storage type is provided.

```ts
new BrowserStorage("invalid");
```

Expected values are:

```ts
"local"
```

or:

```ts
"session"
```

### `InvalidKeyError`

Thrown when a storage key is not a string or number.

### `InvalidValueError`

Thrown when `undefined` is provided as a value.

### `InvalidDataError`

Thrown when invalid data is passed to `setAll()`.

### `InvalidFunctionError`

Thrown when the callback passed to `update()` is not a function.

## Browser Environment

`smart-storage` uses the browser's native:

```ts
localStorage
```

and:

```ts
sessionStorage
```

APIs.

Therefore, it is intended for browser environments where these APIs are available.

For server-side environments such as Node.js, the browser Storage API is not available by default.

## API Overview

| Method                  | Description                      |
| ----------------------- | -------------------------------- |
| `getAll()`              | Returns all stored data          |
| `get(key)`              | Gets a value by key              |
| `deepGet(key)`          | Gets a deeply nested value       |
| `set(key, value)`       | Stores a value                   |
| `deepSet(key, value)`   | Sets a deeply nested value       |
| `update(key, callback)` | Updates a value using a callback |
| `setAll(data)`          | Stores multiple values           |
| `remove(key)`           | Removes a value                  |
| `clear()`               | Clears the selected storage      |
| `keys()`                | Returns all keys                 |
| `has(key)`              | Checks whether a key exists      |

## Contributing

Contributions, bug reports, feature requests, and suggestions are welcome.

Please visit the [GitHub](https://github.com/abdu-selam/smart-storage/issues) repository to contribute or report an issue.

## License

MIT © Abduselam Awel

