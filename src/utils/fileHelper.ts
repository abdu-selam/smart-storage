import fs from "node:fs/promises";
import nodePath from "node:path";

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

export const createJson = async (path: string, data: string): Promise<void> => {
  const checkJson = await isJson(path);
  if (checkJson) return;

  await fs.writeFile(path, data);
};
