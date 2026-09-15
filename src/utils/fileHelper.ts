import fs from "node:fs/promises";
import nodePath from "node:path";
import type { JsonDataType } from "../types/JsonStorageTypes.js";

export const isFileExist = async (path: string): Promise<boolean> => {
  try {
    await fs.access(path);
    const stats = await fs.stat(path);
    return stats.isFile();
  } catch (error) {
    return false;
  }
};

export const isJson = async (path: string): Promise<boolean> => {
  const isFile = await isFileExist(path);
  if (!isFile) return false;

  const ext = nodePath.extname(path);
  if (ext !== ".json") return false;

  try {
    const data = await (await fs.readFile(path)).toString();
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
};

export const createJson = async (
  path: string,
  data: string,
): Promise<string> => {
  const checkJson = await isJson(path);
  if (checkJson) {
    const data = await readFile(path);
    return data || "{}";
  }

  await fs.writeFile(path, data);
  return data;
};

export const readFile = async (path: string): Promise<string | null> => {
  const check = await isFileExist(path);
  if (!check) return null;

  const data = (await fs.readFile(path)).toString();

  return data;
};

export const saveJson = async (
  path: string,
  data: JsonDataType,
): Promise<void> => {
  const check = await isJson(path);
  let localPath = path;

  if (!check) {
    const ext = nodePath.extname(path);
    if (ext !== ".json") {
      localPath = path + ".json";
    }
  }

  const dataToWrite = JSON.stringify(data, null, 2);
  await fs.writeFile(localPath, dataToWrite);
};
