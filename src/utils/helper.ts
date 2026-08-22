export const isObject = (data: any): boolean => {
  return Object.prototype.toString.call(data) === "[object Object]";
};
