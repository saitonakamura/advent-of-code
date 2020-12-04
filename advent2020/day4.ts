import { pid } from "process";
import { read } from "./helper";

const required = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"] as const;

type K = typeof required[number];

const isValid = (kvs: Array<readonly [K, string]>) => {
  return required.every((key) => kvs.some(([k, v]) => k === key && !!v));
};

const isHgt = (s: string) => {
  switch (true) {
    case s.endsWith("cm"): {
      const h = parseInt(s.substring(0, s.length - 2), 10);
      return h >= 150 && h <= 193;
    }
    case s.endsWith("in"): {
      const h = parseInt(s.substring(0, s.length - 2), 10);
      return h >= 59 && h <= 76;
    }
    default:
      return false;
  }
};

const hclRegex = /^#[0-9a-f]{6}$/;

const eclVals = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];

const pidRegex = /^[0-9]{9}$/;

const isValid2 = (kvs: Array<readonly [K, string]>) => {
  return required.every((key) => {
    // console.log({ key });
    const r = kvs.some(([k, v = ""]) => {
      // console.log({ k, v });
      switch (key) {
        case "byr":
          return k === key && v.length === 4 && v >= "1920" && v <= "2002";
        case "iyr":
          return k === key && v.length === 4 && v >= "2010" && v <= "2020";
        case "eyr":
          return k === key && v.length === 4 && v >= "2020" && v <= "2030";
        case "hgt":
          return k === key && isHgt(v);
        case "hcl":
          return k === key && hclRegex.test(v);
        case "ecl":
          return k === key && eclVals.includes(v);
        case "pid":
          return k === key && pidRegex.test(v);
        default:
          return false;
      }
    });
    // console.log({ r });
    // console.log("\n");
    return r;
  });
};

const parseStr = (s: string) => {
  return s
    .split(/\s/)
    .filter(Boolean)
    .map((kv) => kv.split(":"))
    .map(([k, v]) => [k as K, v] as const);
};

type T = ReturnType<typeof parseStr>;

const f1 = (arr: T[]) => {
  return arr.reduce((acc, curr) => (isValid(curr) ? acc + 1 : acc), 0);
};

const f2 = (arr: T[]) => {
  return arr.reduce((acc, curr) => (isValid2(curr) ? acc + 1 : acc), 0);
};

const parseAll = (s: string) => {
  return s.replace("\r\n", "\n").split("\n\n").filter(Boolean);
};

(async () => {
  console.log(f1((await read(4, 1, parseAll)).map(parseStr)));
  console.log(f2((await read(4, 1, parseAll)).map(parseStr)));
  console.log("\n");
  console.log(f1((await read(4, 2, parseAll)).map(parseStr)));
  console.log(f2((await read(4, 2, parseAll)).map(parseStr)));
  console.log("\n");
  console.log(f2((await read(4, 3, parseAll)).map(parseStr)));
  console.log(f2((await read(4, 4, parseAll)).map(parseStr)));
})();
