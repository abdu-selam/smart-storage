export class ConstructionError extends Error {
  constructor() {
    super(`Invalid storage type. Expected "local" or "session".`);

    this.name = "ConstructionError";

    Object.setPrototypeOf(this, ConstructionError.prototype);
  }
}

export class InvalidKeyError extends Error {
  constructor() {
    super("Invalid storage key. Expected a string or number.");

    this.name = "InvalidKeyError";

    Object.setPrototypeOf(this, InvalidKeyError.prototype);
  }
}

export class InvalidDataError extends Error {
  constructor() {
    super("Invalid storage data. Expected a non-null object.");

    this.name = "InvalidDataError";

    Object.setPrototypeOf(this, InvalidDataError.prototype);
  }
}

export class InvalidValueError extends Error {
  constructor() {
    super("Invalid value. A value must be provided.");

    this.name = "InvalidValueError";

    Object.setPrototypeOf(this, InvalidValueError.prototype);
  }
}
