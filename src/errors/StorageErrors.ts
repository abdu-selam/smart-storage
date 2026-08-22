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
