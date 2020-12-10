import { read } from "./helper";

const parseStr = (s: string) => parseInt(s, 10);

type T = ReturnType<typeof parseStr>;

const f1 = (arr: T[]) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const m = [0, 0, 1] as [number, number, number];
  for (let i = 0; i < sorted.length; i++) {
    const prev = i === 0 ? 0 : sorted[i - 1];
    const diff = sorted[i] - prev;
    m[diff - 1]++;
  }

  console.log(m);
  return m[0] * m[2];
};
const f2 = (arr: T[]) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const diffs = new Array(sorted.length);
  for (let i = 0; i < sorted.length; i++) {
    const prev = i === 0 ? 0 : sorted[i - 1];
    diffs[i] = sorted[i] - prev;
  }

  let combinations = 1;
  let chainLength: number | undefined = undefined;

  // Can't seem to find the right formula
  // It's combinations of n by k where n = chainLength - 1 and k is [2, n]
  // But with caveat: you need to maintain distance no more than 3 between elements
  // So for k >= 3 combinations are reduced, but I don't understand how
  // Combinations is n! / (k! * (n - k)!)
  const getCombinations = (chainLength: number) => {
    switch (chainLength) {
      case 2:
        return 2;
      case 3:
        return (3 + 1);
      case 4:
        return (3 + 3 + 1);
      case 5:
        return (4 + 6 + 2 + 1); // Usual will be (4 + 6 + 4 + 1)
      default:
        return 1;
    }
  };

  for (let i = 1; i < diffs.length; i++) {
    if (chainLength !== undefined && diffs[i] !== 1) {
      console.log({ chainLength });
      combinations *= getCombinations(chainLength);
      chainLength = undefined;
    } else if (diffs[i] === 1 && diffs[i - 1] === 1) {
      chainLength = chainLength === undefined ? 2 : chainLength + 1;
    }
  }

  if (chainLength !== undefined) {
    combinations *= getCombinations(chainLength);
  }

  console.log(JSON.stringify(sorted));
  console.log(JSON.stringify(diffs));

  return combinations;
};

(async () => {
  console.log(f1((await read(10, 1)).map(parseStr)));
  console.log(f1((await read(10, 3)).map(parseStr)));
  console.log(f1((await read(10, 2)).map(parseStr)));
  console.log("");
  console.log(f2((await read(10, 1)).map(parseStr)));
  console.log(f2((await read(10, 2)).map(parseStr)));
  console.log(f2((await read(10, 3)).map(parseStr)));
})();
