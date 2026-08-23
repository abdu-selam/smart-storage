export const isObject = (data: any): boolean => {
  return Object.prototype.toString.call(data) === "[object Object]";
};

export const isIndex = (key: string): boolean => /^\d+$/.test(key);
