import { reduce } from "fp-ts/lib/Array";
import fs from "fs/promises";

const defaultParse = (s: string) =>
  s
    .replace("\r\n", "\n")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

export function read(day: number, input: number): Promise<string[]>;
export function read<T>(
  day: number,
  input: number,
  parse: (s: string) => T
): Promise<T>;
export async function read<T extends string[]>(
  day: number,
  input: number,
  parse?: (s: string) => T
) {
  return (parse ?? defaultParse)(
    await fs.readFile(`./day${day}-input${input}.txt`, { encoding: "utf-8" })
  );
}

export const sum = reduce(0, (acc, curr: number) => acc + curr);

export const tapHack = <T>(effect: (v: T) => void) => (v: T): T => {
  effect(v);
  return v;
};
