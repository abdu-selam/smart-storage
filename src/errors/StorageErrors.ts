export class InvalidTypeError extends Error {
  constructor() {
    super("message");

    this.name = "InvalidTypeError";
  }
}

export class InvalidNameError extends Error {
  constructor() {
    super("message");
    this.name = "InvalidNameErro";
  }
}

export class InvalidValueError extends Error {
  constructor() {
    super("message");
    this.name = "InvalidValueError";
  }
}

export class InvalidOperationError extends Error {
  constructor() {
    super("message");
    this.name = "InvalidValueError";
  }
}
