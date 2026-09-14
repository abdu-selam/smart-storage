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

