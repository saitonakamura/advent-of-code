import fs from "fs/promises";

const defaultParse = (s: string) =>
  s
    .replace("\r\n", "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

export const read = async (day: number, input: number, parse = defaultParse) =>
  parse(
    await fs.readFile(`./day${day}-input${input}.txt`, { encoding: "utf-8" })
  );
