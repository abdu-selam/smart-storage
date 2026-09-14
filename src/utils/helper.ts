export const isObject = (data: any): boolean => {
  return Object.prototype.toString.call(data) === "[object Object]";
};

export const isIndex = (key: string | number): boolean =>
  /^\d+$/.test(typeof key === "string" ? key : key.toString());
