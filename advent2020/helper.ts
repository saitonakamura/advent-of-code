import fs from "fs/promises";

export const read = async (day: number, input: number) =>
  (await fs.readFile(`./day${day}-input${input}.txt`, { encoding: "utf-8" }))
    .replace("\r\n", "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
