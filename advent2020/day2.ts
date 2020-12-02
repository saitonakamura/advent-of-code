import fs from "fs/promises";

const parseStr = (s: string) => {
  const [policyStr, password] = s.split(": ");

  const [countStr, symbol] = policyStr.split(" ");
  const [min, max] = countStr.split("-").map((str) => parseInt(str, 10));

  const policy = {
    count1: min,
    count2: max,
    symbol,
  };

  return {
    policy,
    password,
  };
};

type T = ReturnType<typeof parseStr>;

const input = (await fs.readFile("./day2-input1.txt", { encoding: "utf-8" }))
  .replace("\r\n", "\n")
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean)
  .map(parseStr);

const f1 = (arr: T[]) => {
  let validPasswordsCount = 0;

  for (const thing of arr) {
    let symbolInStrCount = 0;

    for (const symb of [...thing.password]) {
      if (symb === thing.policy.symbol) {
        symbolInStrCount++;
      }

      if (symbolInStrCount > thing.policy.count2) {
        break;
      }
    }

    if (
      symbolInStrCount >= thing.policy.count1 &&
      symbolInStrCount <= thing.policy.count2
    ) {
      validPasswordsCount++;
    }
  }

  return validPasswordsCount;
};

const f2 = (arr: T[]) => {
  let validPasswordsCount = 0;

  for (const thing of arr) {
    if (
      (thing.password[thing.policy.count1 - 1] === thing.policy.symbol &&
        thing.password[thing.policy.count2 - 1] !== thing.policy.symbol) ||
      (thing.password[thing.policy.count1 - 1] !== thing.policy.symbol &&
        thing.password[thing.policy.count2 - 1] === thing.policy.symbol)
    ) {
      validPasswordsCount++;
    }
  }

  return validPasswordsCount;
};

console.log(f1(input));
console.log(f2(input));
